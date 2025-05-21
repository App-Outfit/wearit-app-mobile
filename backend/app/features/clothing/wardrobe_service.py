from uuid import uuid4, UUID
from datetime import datetime
from fastapi import UploadFile
from typing import List

from app.features.clothing.wardrobe_repo import WardrobeRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.features.clothing.wardrobe_schema import (
    ClothCreate, ClothCreateResponse,
    ClothResponse, ClothListResponse, ClothDeleteResponse,
    OutfitCreate, OutfitCreateResponse,
    OutfitResponse, OutfitListResponse, OutfitDeleteResponse,
    CategoryResponse, CategoryListResponse
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

    # ----- Cloth -----

    async def create_cloth(
        self,
        dto: ClothCreate,
        file: UploadFile
    ) -> ClothCreateResponse:
        logger.info("🟡 [Service] Creating cloth for user %s", dto.user_id)

        exists = await self.repo.exists_category(dto.user_id, dto.type)
        if not exists:
            raise NotFoundError(f"Category {dto.type} not found")

        cloth_id = str(uuid4())
        created_at = datetime.now()
        object_key = f"users/{dto.user_id}/clothes/{cloth_id}.jpg"

        try:
            await self.storage.upload_cloth_image(dto.user_id, cloth_id, file)
        except Exception:
            logger.exception("🔴 [Service] S3 upload failed")
            raise InternalServerError("Failed to upload image")

        try:
            record = await self.repo.create_cloth(
                cloth_id=cloth_id,
                user_id=dto.user_id,
                name=dto.name,
                type=dto.type,
                image_url=object_key,
                tags=dto.tags,
                created_at=created_at
            )
        except Exception:
            logger.exception("🔴 [Service] DB insert failed")
            raise InternalServerError("Failed to save cloth")
        if not record:
            raise InternalServerError("Failed to save cloth")

        try:
            signed_url = await self.storage.get_cloth_url(object_key)
        except Exception:
            logger.exception("🔴 [Service] Failed to generate presigned URL")
            raise InternalServerError("Failed to generate image URL")

        return ClothCreateResponse(
            id=UUID(cloth_id),
            image_url=signed_url,
            tags=dto.tags,
            created_at=created_at,
            message="Cloth created successfully"
        )

    async def get_cloth_by_id(self, cloth_id: str) -> ClothResponse:
        logger.info("🟡 [Service] Fetching cloth %s", cloth_id)
        rec = await self.repo.get_cloth_by_id(cloth_id)
        if not rec:
            logger.warning("🔴 [Service] Cloth %s not found", cloth_id)
            raise NotFoundError(f"Cloth {cloth_id} not found")

        try:
            url = await self.storage.get_cloth_url(rec.image_url)
        except Exception:
            logger.exception("🔴 [Service] Failed to generate presigned URL")
            raise InternalServerError("Failed to generate image URL")

        return ClothResponse(
            id=UUID(rec.id),
            user_id=rec.user_id,
            name=rec.name,
            type=rec.type,
            image_url=url,
            tags=rec.tags
        )

    async def get_clothes(self, user_id: str, cloth_type: str) -> ClothListResponse:
        logger.info("🟡 [Service] Listing clothes of type %s for %s", cloth_type, user_id)
        recs = await self.repo.get_clothes(user_id, cloth_type)
        logger.warning("🟡 [Service] Found %d clothes", len(recs))
        if not recs:
            return ClothListResponse(clothes=[])
        
        clothes = []
        for r in recs:
            try:
                url = await self.storage.get_cloth_url(r.image_url)
            except Exception:
                logger.exception("🔴 [Service] Failed to generate presigned URL for %s", r.id)
                raise InternalServerError("Failed to generate image URL")
            clothes.append(ClothResponse(
                id=UUID(r.id),
                user_id=r.user_id,
                name=r.name,
                type=r.type,
                image_url=url,
                tags=r.tags
            ))

        return ClothListResponse(clothes=clothes)

    async def delete_cloth(self, cloth_id: str) -> ClothDeleteResponse:
        logger.info("🟡 [Service] Deleting cloth %s", cloth_id)
        rec = await self.repo.get_cloth_by_id(cloth_id)
        if not rec:
            logger.warning("🔴 [Service] Cloth %s not found", cloth_id)
            raise NotFoundError(f"Cloth {cloth_id} not found")

        try:
            await self.storage.delete_cloth_image(rec.user_id, cloth_id)
        except Exception:
            logger.exception("🔴 [Service] S3 delete failed")
            raise InternalServerError("Failed to delete image")

        removed = await self.repo.delete_cloth(cloth_id)
        if not removed:
            raise InternalServerError("Failed to delete cloth")

        return ClothDeleteResponse(message=f"Cloth {cloth_id} deleted successfully")
    
    # ----- Category -----

    async def create_category(self, user_id: str, name: str) -> CategoryResponse:
        exist = await self.repo.exists_category(user_id, name)
        if exist:
            raise InternalServerError(f"Category {name} already exists")
        logger.info("🟡 [Service] Creating category %s for user %s", name, user_id)
        doc = await self.repo.create_category(user_id, name, id=str(uuid4()))
        return CategoryResponse(
            id=doc["_id"],
            user_id=doc["user_id"],
            name=doc["name"],
            created_at=doc["created_at"],
        )

    async def list_categories(self, user_id: str) -> CategoryListResponse:
        docs = await self.repo.list_categories(user_id)
        return CategoryListResponse(
            categories=[
                CategoryResponse(
                    id=d["id"],
                    user_id=user_id,
                    name=d["name"],
                    created_at=d["created_at"],
                )
                for d in docs
            ]
        )

    # ----- Outfit -----

    async def create_outfit(
        self,
        dto: OutfitCreate
    ) -> OutfitCreateResponse:
        logger.info("🟡 [Service] Creating outfit for user %s", dto.user_id)
        outfit_id = str(uuid4())
        created_at = datetime.now()

        if not dto.cloth_ids:
            raise InternalServerError("At least one cloth required for outfit")

        try:
            record = await self.repo.create_outfit(
                outfit_id=outfit_id,
                user_id=dto.user_id,
                body_id=str(dto.body_id),
                cloth_ids=[str(cid) for cid in dto.cloth_ids],
                created_at=created_at
            )
        except Exception:
            logger.exception("🔴 [Service] DB insert failed")
            raise InternalServerError("Failed to save outfit")
        if not record:
            raise InternalServerError("Failed to save outfit")

        return OutfitCreateResponse(
            id=UUID(outfit_id),
            body_id=dto.body_id,
            cloth_ids=dto.cloth_ids,
            created_at=created_at,
            message="Outfit saved successfully"
        )

    async def get_outfit_by_id(self, outfit_id: str) -> OutfitResponse:
        logger.info("🟡 [Service] Fetching outfit %s", outfit_id)
        rec = await self.repo.get_outfit_by_id(outfit_id)
        if not rec:
            raise NotFoundError(f"Outfit {outfit_id} not found")

        return OutfitResponse(
            id=UUID(rec.id),
            user_id=rec.user_id,
            body_id=UUID(rec.body_id),
            cloth_ids=[UUID(cid) for cid in rec.cloth_ids],
            created_at=rec.created_at
        )

    async def get_outfits(self, user_id: str) -> OutfitListResponse:
        logger.info("🟡 [Service] Listing outfits for user %s", user_id)
        recs = await self.repo.get_outfits(user_id)
        if not recs:
            raise NotFoundError(f"No outfits for user {user_id}")

        outfits = [OutfitResponse(
            id=UUID(r.id),
            user_id=r.user_id,
            body_id=UUID(r.body_id),
            cloth_ids=[UUID(cid) for cid in r.cloth_ids],
            created_at=r.created_at
        ) for r in recs]

        return OutfitListResponse(outfits=outfits)

    async def delete_outfit(self, outfit_id: str) -> OutfitDeleteResponse:
        logger.info("🟡 [Service] Deleting outfit %s", outfit_id)
        rec = await self.repo.get_outfit_by_id(outfit_id)
        if not rec:
            raise NotFoundError(f"Outfit {outfit_id} not found")

        removed = await self.repo.delete_outfit(outfit_id)
        if not removed:
            raise InternalServerError("Failed to delete outfit")

        return OutfitDeleteResponse(message=f"Outfit {outfit_id} deleted successfully")