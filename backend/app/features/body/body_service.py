from bson import ObjectId
import asyncio
from fastapi import UploadFile
from app.core.logging_config import logger
from .body_repo import BodyRepository
from .body_schema import (
    BodyUploadResponse, BodyListResponse, BodyItem, BodyMasksResponse
)
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.core.errors import NotFoundError, UnauthorizedError

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
        asyncio.create_task(self._simulate_preprocessing(user.id, body_id_str))

        return BodyUploadResponse(
            body_id=body_id_str,
            status="pending",
            message="Body uploaded. Preprocessing started."
        )

    # 🔧 Fake preprocessing async
    async def _simulate_preprocessing(self, user_id: str, body_id: str):
        logger.info(f"🧪 Preprocessing body {body_id}")
        await asyncio.sleep(4)

        # Stocke les chemins internes (pas les URLs signées) dans Mongo
        masks = {
            "mask_upper": StoragePathBuilder.body_mask(user_id, body_id, "upper"),
            "mask_lower": StoragePathBuilder.body_mask(user_id, body_id, "lower"),
            "mask_dress": StoragePathBuilder.body_mask(user_id, body_id, "dress"),
        }

        await self.repo.set_masks(body_id, masks)
        logger.info(f"✅ Preprocessing done for body {body_id}")

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