from bson import ObjectId
import asyncio
from datetime import datetime
from app.core.logging_config import logger
from app.core.config import settings
from app.infrastructure.runpod.runpod_client import create_runpod_client, RunPodError, RunPodTimeoutError
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonItem, TryonDeleteResponse
)
import aiohttp
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.core.errors import NotFoundError, UnauthorizedError, InternalServerError
from app.core.pubsub_manager import pubsub_manager
from fastapi import WebSocket, WebSocketDisconnect

class TryonService:
    def __init__(
        self,
        repo: TryonRepository,
        storage: StorageRepository,
        body_repo: BodyRepository,
        clothing_repo: ClothingRepository
    ):
        self.repo = repo
        self.storage = storage
        self.body_repo = body_repo
        self.clothing_repo = clothing_repo

    async def create_tryon(self, user, payload: TryonCreateRequest) -> TryonCreateResponse:
        if user.credits <= 0:
            raise UnauthorizedError("Insufficient credits to create a tryon")

        body_id = payload.body_id
        clothing_id = payload.clothing_id

        body = await self.body_repo.get_body_by_id(body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("Invalid body")

        cloth = await self.clothing_repo.get_clothing_by_id(clothing_id)
        if not cloth or str(cloth.user_id) != str(user.id):
            raise UnauthorizedError("Invalid clothing")

        existing = await self.repo.get_all_by_body_and_clothing(body_id, clothing_id)
        version = len(existing) + 1

        tryon_id = ObjectId()
        now = datetime.now()

        record = await self.repo.create_tryon(
            tryon_id=tryon_id,
            user_id=user.id,
            body_id=body.id,
            clothing_id=cloth.id,
            version=version,
            created_at=now
        )

        asyncio.create_task(self._call_ia(user.id, body, tryon_id, cloth))

        return TryonCreateResponse(
            tryon_id=str(record.id),
            created_at=record.created_at,
            message="Tryon created",
            status=record.status,
            version=version
        )

    async def _publish_error(self, user_id: str, tryon_id: str, msg: str):
        await pubsub_manager.publish(
            user_id,
            {
                "type":     "tryon_update",
                "tryon_id": str(tryon_id),
                "status":   "failed",
                "error":    msg,
            }
        )

    async def _call_ia(self, user_id: str, body, tryon_id: str, clothing):
        logger.info(f"🤖 [IA] Starting virtual try-on for body={body.id} × clothing={clothing.id}")
        body_url = await self.storage.get_presigned_url(body.image_url)
        clothing_url = await self.storage.get_presigned_url(clothing.image_url)

        mask_field_map = {
            "upper": "mask_upper",
            "lower": "mask_lower",
            "dress": "mask_dress",
        }
        mask_attr = mask_field_map.get(clothing.cloth_type)
        if not mask_attr:
            error_msg = f"No mask defined for cloth_type '{clothing.cloth_type}'"
            logger.error(f"🔴 [IA] {error_msg}")
            await self.repo.set_error(tryon_id, error_msg)
            await self._publish_error(user_id, tryon_id, error_msg)
            raise ValueError(error_msg)
        
        mask_key = getattr(body, mask_attr, None)
        if not mask_key:
            error_msg = f"Body has no attribute '{mask_attr}' or it's empty"
            logger.error(f"🔴 [IA] {error_msg}")
            await self.repo.set_error(tryon_id, error_msg)
            await self._publish_error(user_id, tryon_id, error_msg)
            raise ValueError(error_msg)
        
        mask_url = await self.storage.get_presigned_url(mask_key)
                
        try:
            # Créer le client RunPod et lancer l'inférence
            async with create_runpod_client() as runpod_client:
                output_url = await runpod_client.run_inference(
                    input_data={
                        "person": body_url,
                        "cloth": clothing_url,
                        "mask": mask_url,
                        "steps": 50,
                        "guidance_scale": 2.0,  # Float comme dans votre exemple
                        "return_dict": True,    # Comme dans votre exemple
                    },
                    upload_files=settings.RUNPOD_UPLOAD_FILES
                )
                
        except RunPodTimeoutError as e:
            msg = f"Timeout lors de la génération IA: {e}"
            logger.error(f"🔴 [IA] {msg}")
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)
            
        except RunPodError as e:
            msg = f"Erreur RunPod: {e}"
            logger.error(f"🔴 [IA] {msg}")
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)
            
        except Exception as e:
            msg = f"Échec de la génération IA: {e}"
            logger.exception(f"🔴 [IA] {msg}")
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)
        
        if not isinstance(output_url, str):
            output_url = str(output_url)
        logger.info(f"✅ [IA] RunPod generation completed, processing result image")
        
        try:
            if output_url.startswith('data:image'):
                # Cas 1: URL data:image (base64) - décoder directement
                logger.info(f"📥 [IA] Processing data:image base64")
                
                # Extraire la partie base64 après 'data:image/png;base64,'
                base64_data = output_url.split(',', 1)[1]
                
                import base64
                img_bytes = base64.b64decode(base64_data)
                logger.info(f"📥 [IA] Decoded base64 image: {len(img_bytes)} bytes")
                
            elif output_url.startswith('http'):
                # Cas 2: URL HTTP classique - télécharger
                logger.info(f"🌐 [IA] Downloading from HTTP URL")
                
                async with aiohttp.ClientSession() as session:
                    async with session.get(output_url) as resp:
                        logger.info(f"🌐 [IA] Download response status: {resp.status}")
                        resp.raise_for_status()
                        img_bytes = await resp.read()
                        logger.info(f"📥 [IA] Downloaded image: {len(img_bytes)} bytes")
            else:
                raise ValueError(f"Format d'URL non supporté: {output_url[:50]}...")
                
        except Exception as e:
            msg = f"Échec du traitement de l'image IA: {e}"
            logger.exception(msg)
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)

        s3_key = StoragePathBuilder.tryon(user_id, body.id, tryon_id)
        logger.info(f"☁️ [IA] Uploading to S3")
        
        try:
            await self.storage.upload_image(s3_key, img_bytes)
            logger.info(f"☁️ [IA] S3 upload successful")
        except Exception as e:
            msg = f"Échec de l'upload S3: {e}"
            logger.exception(msg)
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)

        try:
            await self.repo.set_tryon(tryon_id, s3_key)
            logger.info(f"💾 [IA] Database updated successfully for tryon {tryon_id}")
        except Exception as e:
            msg = f"Échec de la sauvegarde en base: {e}"
            logger.exception(msg)
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)
        
        logger.info(f"✅ [IA] Output stored successfully")
        
        public_url = await self.storage.get_presigned_url(s3_key)

        logger.info(f"✅ [IA] RunPod generation completed successfully")
        
        await pubsub_manager.publish(
            user_id,
            {
                "type":       "tryon_update",
                "tryon_id":   str(tryon_id),
                "body_id":    str(body.id),
                "clothing_id": str(clothing.id),
                "created_at": datetime.now().isoformat(),
                "version":    1,  # TODO: gérer les versions
                "output_url": public_url,
                "status":     "ready",
            }
        )
        logger.info(f"✅ [IA] SSE published for user {user_id} with tryon {tryon_id}")

    async def get_all_tryons(self, user_id: str) -> TryonListResponse:
        docs = await self.repo.get_all_by_user(user_id)
        tryons = []
        for doc in docs:
            if doc.output_url:
                url = await self.storage.get_presigned_url(doc.output_url)
            else:
                url = None

            if not url:
                logger.warning(f"🔴 [Tryon] No output URL for tryon {doc.id}, skipping")
                continue

            tryons.append(TryonItem(
                id=str(doc.id),
                output_url=url,
                body_id=str(doc.body_id),
                clothing_id=str(doc.clothing_id),
                status=doc.status,
                error=getattr(doc, 'error', None),
                created_at=doc.created_at,
                version=doc.version
            ))
        return TryonListResponse(tryons=tryons)

    async def get_tryon_by_id(self, tryon_id: str, user) -> TryonDetailResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise NotFoundError("Tryon not found")

        url = await self.storage.get_presigned_url(doc.output_url)
        return TryonDetailResponse(
            id=str(doc.id),
            output_url=url,
            body_id=str(doc.body_id),
            clothing_id=str(doc.clothing_id),
            status=doc.status,
            error=getattr(doc, 'error', None),
            version=doc.version,
            created_at=doc.created_at,
            updated_at=doc.updated_at
        )

    async def delete_tryon(self, tryon_id: str, user) -> TryonDeleteResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this tryon")

        await self.storage.delete_image(doc.output_url)
        await self.repo.delete_tryon(tryon_id)
        logger.info(f"🗑️ Deleted tryon {tryon_id}")
        return TryonDeleteResponse(message="Tryon deleted")
    
    async def stream_tryon_ws(self, websocket: WebSocket, user_id: str):
        """
        Prend en charge une connexion WebSocket et push chaque événement
        try-on pour l'utilisateur donné.
        """
        # 1) Abonne l'utilisateur à son canal
        queue = pubsub_manager.subscribe(user_id)
        try:
            # 2) Tant que le client est connecté, on envoie les messages
            while True:
                data = await queue.get()           # ceci renvoie déjà une JSON string
                await websocket.send_text(data)    # on pousse texte pur
        except WebSocketDisconnect:
            # 3) Le client a fermé la connexion
            pass
        finally:
            # 4) Désabonnement propre
            pubsub_manager.unsubscribe(user_id, queue)

    async def get_tryons_by_body(
        self, body_id: str, user
    ) -> TryonListResponse:
        """
        Récupère tous les try-ons pour un body spécifique.
        """
        body = await self.body_repo.get_body_by_id(body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body")

        docs = await self.repo.get_all_by_body(body_id)
        tryons = []
        for doc in docs:
            if doc.output_url:
                url = await self.storage.get_presigned_url(doc.output_url)
            else:
                url = None

            if not url:
                logger.warning(f"🔴 [Tryon] No output URL for tryon {doc.id}, skipping")
                continue

            tryons.append(TryonItem(
                id=str(doc.id),
                output_url=url,
                body_id=str(doc.body_id),
                clothing_id=str(doc.clothing_id),
                status=doc.status,
                error=getattr(doc, 'error', None),
                created_at=doc.created_at,
                version=doc.version
            ))
        return TryonListResponse(tryons=tryons)