from datetime import datetime
from uuid import uuid4, UUID
from fastapi import UploadFile

from app.repositories.wardrobe_repo import WardrobeRepository
from app.repositories.storage_repo import StorageRepository
from app.api.schemas.wardrobe_schema import (
    ClothCreate, ClothCreateResponse,
    ClothResponse, ClothListResponse, ClothDeleteResponse
)
from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger

class WardrobeService:
    def __init__(
        self,
        repository: WardrobeRepository,
        storage_repo: StorageRepository = None
    ):
        self.repo = repository
        self.storage = storage_repo or StorageRepository()

    async def create_cloth(self, cloth: ClothCreate) -> ClothCreateResponse:
        logger.info("🟡 [Service] Creating cloth for user %s", cloth.user_id)

        cloth_id = str(uuid4())
        # 1) upload to S3
        try:
            image_url = await self.storage.upload_cloth_image(
                cloth.user_id, cloth_id, cloth.file
            )
        except Exception:
            logger.exception("🔴 [Service] S3 upload failed")
            raise InternalServerError("Failed to upload image to storage")

        if not image_url:
            logger.error("🔴 [Service] No URL from S3")
            raise InternalServerError("Failed to upload image to storage")

        # 2) insert to MongoDB
        created_at = datetime.now()
        try:
            record = await self.repo.create_cloth(
                cloth_id=cloth_id,
                user_id=cloth.user_id,
                name=cloth.name,
                type=cloth.type,
                image_url=image_url,
                created_at=created_at,
            )
        except Exception:
            logger.exception("🔴 [Service] DB insert failed")
            raise InternalServerError("Failed to create cloth in database")

        if record is None:
            logger.error("🔴 [Service] Repository returned None")
            raise InternalServerError("Failed to create cloth in database")

        logger.debug("🟢 [Service] Cloth %s created", cloth_id)
        return ClothCreateResponse(
            id=UUID(cloth_id),
            message="Cloth created successfully",
            image_url=image_url,
            created_at=created_at,
        )

    async def get_cloth_by_id(self, cloth_id: str) -> ClothResponse:
        logger.info("🟡 [Service] Fetching cloth %s", cloth_id)
        try:
            record = await self.repo.get_cloth_by_id(cloth_id)
        except Exception:
            logger.exception("🔴 [Service] DB query failed")
            raise InternalServerError("Failed to fetch cloth")

        if not record:
            logger.warning("🔴 [Service] Cloth %s not found", cloth_id)
            raise NotFoundError(f"Cloth {cloth_id} not found")

        return ClothResponse(
            id=UUID(record.id),
            user_id=record.user_id,
            name=record.name,
            type=record.type,
            image_url=record.image_url,
        )

    async def get_clothes(self, user_id: str, cloth_type: str) -> ClothListResponse:
        logger.info(
            "🟡 [Service] Fetching clothes of type %s for user %s",
            cloth_type, user_id
        )
        try:
            records = await self.repo.get_clothes(user_id, cloth_type)
        except Exception:
            logger.exception("🔴 [Service] DB query failed")
            raise InternalServerError("Failed to fetch clothes")

        if not records:
            logger.warning(
                "🔴 [Service] No clothes for user %s type %s",
                user_id, cloth_type
            )
            raise NotFoundError(
                f"No clothes found for user {user_id} and type {cloth_type}"
            )

        return ClothListResponse(
            clothes=[
                ClothResponse(
                    id=UUID(r.id),
                    user_id=r.user_id,
                    name=r.name,
                    type=r.type,
                    image_url=r.image_url,
                ) for r in records
            ]
        )

    async def delete_cloth(self, cloth_id: str) -> ClothDeleteResponse:
        logger.info("🟡 [Service] Deleting cloth %s", cloth_id)

        # 1) fetch
        try:
            record = await self.repo.get_cloth_by_id(cloth_id)
        except Exception:
            logger.exception("🔴 [Service] DB query failed")
            raise InternalServerError("Failed to fetch cloth")

        if not record:
            logger.warning("🔴 [Service] Cloth %s not found", cloth_id)
            raise NotFoundError(f"Cloth {cloth_id} not found")

        # 2) delete from S3
        try:
            ok = await self.storage.delete_cloth_image(
                record.user_id, cloth_id
            )
        except Exception:
            logger.exception("🔴 [Service] S3 delete failed")
            raise InternalServerError("Failed to delete image from storage")

        if not ok:
            logger.error("🔴 [Service] S3 delete returned False")
            raise InternalServerError("Failed to delete image from storage")

        # 3) delete from DB
        try:
            removed = await self.repo.delete_cloth(cloth_id)
        except Exception:
            logger.exception("🔴 [Service] DB delete failed")
            raise InternalServerError("Failed to delete cloth from database")

        if not removed:
            logger.error("🔴 [Service] Repository delete returned False")
            raise InternalServerError("Failed to delete cloth from database")

        logger.debug("🟢 [Service] Cloth %s deleted", cloth_id)
        return ClothDeleteResponse(
            message=f"Cloth {cloth_id} deleted successfully"
        )
