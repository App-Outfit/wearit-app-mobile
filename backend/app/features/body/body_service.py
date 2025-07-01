from bson import ObjectId
import asyncio
from fastapi import UploadFile, WebSocket, WebSocketDisconnect
from app.core.logging_config import logger
from .body_repo import BodyRepository
from app.core.pubsub_manager import pubsub_manager
from datetime import datetime
from .body_schema import (
    BodyUploadResponse, BodyListResponse, BodyItem, BodyMasksResponse
)
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.core.errors import NotFoundError, UnauthorizedError
from app.core.config import settings
import replicate

class BodyService:
    def __init__(self, repo: BodyRepository, storage: StorageRepository = None):
        self.repo = repo
        self.storage = storage or StorageRepository()

    # ✅ Upload + Preprocessing
    async def upload_body(self, user, image: UploadFile) -> BodyUploadResponse:
        logger.info(f"📤 Upload body for user {user.id}")

        body_id = ObjectId()
        body_id_str = str(body_id)

        # Génère le chemin S3 pour l'original
        object_key = StoragePathBuilder.body_original(user.id, body_id_str)

        # Upload sur S3
        await self.storage.upload_image(object_key, image)

        # Enregistre l'objet (on garde juste le chemin S3, pas l'URL directe)
        body = await self.repo.create_body(
            user_id=user.id,
            body_id=body_id,
            image_url=object_key
        )

        # Lance preprocessing async
        asyncio.create_task(self._body_preprocessing(user.id, body))

        return BodyUploadResponse(
            body_id=body_id_str,
            status="pending",
            message="Body uploaded. Preprocessing started."
        )
    
    async def _publish_error(self, user_id: str, body_id: str, msg: str):
        await pubsub_manager.publish(
            user_id,
            {
                "type": "body_preprocessing",
                "body_id": str(body_id),
                "status": "failed",
                "error": msg,
            }
        )

    async def _body_preprocessing(self, user_id: str, body):
        logger.info(f"🧪 [IA] Starting preprocessing for body={body.id}")

        body_id = str(body.id)
        original_key = body.image_url

        try:
            # 1️⃣ Génère URL signée pour le modèle
            original_url = await self.storage.get_presigned_url(original_key)

            # 2️⃣ Appel IA Replicate (exécuté dans un thread)
            raw_output: dict = await asyncio.to_thread(
                lambda: replicate.run(
                    settings.REPLICATE_BODY_REF,
                    input={
                        "image": original_url,
                        "max_height": 512,
                    }
                )
            )

            if not isinstance(raw_output, dict):
                raise ValueError("Le modèle n’a pas retourné un dict")

            logger.info(f"✅ [IA] Replicate returned: {raw_output}")

            # ✅ 3️⃣ (a) Lire le FileOutput pour l'original et overwrite sur S3
            original_file = raw_output.get("original")
            if not original_file:
                raise ValueError("Pas de champ 'original' dans la sortie IA")

            orig_bytes = await asyncio.to_thread(original_file.read)
            await self.storage.upload_image(original_key, orig_bytes)

            # ✅ 3️⃣ (b) Lire et uploader chaque mask
            mask_map = {
                "upper": "upper",
                "lower": "lower",
                "overall": "dress",
            }
            s3_masks = {}
            for model_key, mask_type in mask_map.items():
                mask_file = raw_output.get(model_key)
                if not mask_file:
                    raise ValueError(f"Pas de mask '{model_key}' dans la sortie IA")

                mask_bytes = await asyncio.to_thread(mask_file.read)

                s3_key = StoragePathBuilder.body_mask(user_id, body_id, mask_type)
                await self.storage.upload_image(s3_key, mask_bytes)
                s3_masks[f"mask_{mask_type}"] = s3_key

            # ✅ 4️⃣ Mise à jour DB (image_url et masks)
            await self.repo.update_body_image_url(body_id, original_key)
            await self.repo.set_masks(body_id, s3_masks)
            logger.info(f"✅ [IA] Body preprocessing done for {body_id}")

            # ✅ 5️⃣ Génère URLs signées pour le front
            presigned_original = await self.storage.get_presigned_url(original_key)
            presigned_masks = {
                field: await self.storage.get_presigned_url(key)
                for field, key in s3_masks.items()
            }

            # ✅ 6️⃣ SSE pour prévenir le front
            await pubsub_manager.publish(
                user_id,
                {
                    "type": "body_preprocessing",
                    "body_id": body_id,
                    "status": "ready",
                    "original": presigned_original,
                    "masks": presigned_masks,
                    "created_at": datetime.now().isoformat(),
                }
            )
            logger.info(f"✅ [IA] SSE published for body {body_id}")

        except Exception as e:
            msg = f"Échec du preprocessing IA : {e}"
            logger.exception(msg)
            await self.repo.set_error(body_id, msg)
            await self._publish_error(user_id, body_id, msg)


    # ✅ Liste des bodies
    async def get_all_bodies(self, user) -> BodyListResponse:
        bodies = await self.repo.get_all_bodies(user.id)
        response_items = []

        for b in bodies:
            presigned_url = await self.storage.get_presigned_url(b.image_url)
            response_items.append(BodyItem(
                id=str(b.id),
                image_url=presigned_url,
                status=b.status,
                is_default=b.is_default,
                created_at=b.created_at
            ))

        return BodyListResponse(bodies=response_items)

    # ✅ Dernier body actif (latest)
    async def get_latest_body(self, user) -> BodyItem:
        body = await self.repo.get_latest_body(user.id)
        if not body:
            raise NotFoundError("No body found.")

        mask_upper_url = await self.storage.get_presigned_url(body.mask_upper)
        mask_lower_url = await self.storage.get_presigned_url(body.mask_lower)
        mask_dress_url = await self.storage.get_presigned_url(body.mask_dress)
        original_url = await self.storage.get_presigned_url(body.image_url)
        
        return BodyItem(
            id=str(body.id),
            image_url=original_url,
            mask_upper=mask_upper_url,
            mask_lower=mask_lower_url,
            mask_dress=mask_dress_url,
            status=body.status,
            is_default=body.is_default,
            created_at=body.created_at
        )

    # ✅ Masques du body + image originale
    async def get_masks(self, body_id: str, user) -> BodyMasksResponse:
        body = await self.repo.get_body_by_id(body_id)
        if str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body.")

        mask_upper_url = await self.storage.get_presigned_url(body.mask_upper)
        mask_lower_url = await self.storage.get_presigned_url(body.mask_lower)
        mask_dress_url = await self.storage.get_presigned_url(body.mask_dress)
        original_url = await self.storage.get_presigned_url(body.image_url)

        return BodyMasksResponse(
            original=original_url,
            mask_upper=mask_upper_url,
            mask_lower=mask_lower_url,
            mask_dress=mask_dress_url
        )

    # ✅ Suppression d’un body
    async def delete_body(self, body_id: str, user):
        body = await self.repo.get_body_by_id(body_id)
        if str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body.")

        # Supprime image originale
        await self.storage.delete_image(body.image_url)

        # Supprime masques s'ils existent
        for key in [body.mask_upper, body.mask_lower, body.mask_dress]:
            if key:
                await self.storage.delete_image(key)

        await self.repo.delete_body(body_id)

        logger.info(f"🗑️ Deleted body {body_id} for user {user.id}")
        return {"message": "Body deleted"}
    
    async def stream_body_ws(self, websocket: WebSocket, user_id: str):
        """
        Prend en charge une connexion WebSocket et push chaque événement
        de prétraitement de body pour l'utilisateur donné.
        """
        # 1) Abonne l'utilisateur à son canal
        queue = pubsub_manager.subscribe(user_id)
        try:
            # 2) Tant que le client est connecté, on envoie les messages
            while True:
                data = await queue.get()           # JSON string depuis le manager
                await websocket.send_text(data)
        except WebSocketDisconnect:
            # 3) Le client a fermé la connexion
            pass
        finally:
            # 4) Désabonnement propre
            pubsub_manager.unsubscribe(user_id, queue)