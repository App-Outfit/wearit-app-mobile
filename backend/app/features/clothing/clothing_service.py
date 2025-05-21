from bson import ObjectId
from datetime import datetime
from fastapi import UploadFile
from app.core.errors import NotFoundError, UnauthorizedError
from .clothing_repo import ClothingRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from .clothing_schema import (
    ClothingUploadResponse, ClothingListResponse,
    ClothingItem, ClothingDetailResponse,
    ClothingDeleteResponse, ClothingUpdate,
    CategoryListResponse
)


class ClothingService:
    def __init__(self, repo: ClothingRepository, storage: StorageRepository = None):
        self.repo = repo
        self.storage = storage or StorageRepository()

    # ✅ Upload clothing
    async def upload_clothing(self, user, file: UploadFile, category: str, name: str = None) -> ClothingUploadResponse:
        clothing_id = ObjectId()

        # 1. Upload original image
        object_key = StoragePathBuilder.clothing_original(user.id, str(clothing_id))
        image_url = await self.storage.upload_image(object_key, file)

        # 2. Save to DB
        created_at = datetime.now()
        clothing = await self.repo.create_clothing(
            user_id=user.id,
            clothing_id=clothing_id,
            image_url=object_key,
            category=category,
            name=name,
            created_at=created_at
        )

        # 3. Génère URL signée
        signed_url = await self.storage.get_presigned_url(clothing.image_url)

        return ClothingUploadResponse(
            clothing_id=str(clothing_id),
            image_url=signed_url,
            resized_url=None,
            category=clothing.category,
            name=clothing.name,
            created_at=clothing.created_at,
            message="Clothing uploaded successfully"
        )

    # ✅ Get all clothing
    async def get_clothes(self, user, category: str = None) -> ClothingListResponse:
        records = await self.repo.get_clothes(user.id, category)
        items = []
        for r in records:
            signed_url = await self.storage.get_presigned_url(r.image_url)
            resized_url = (
                await self.storage.get_presigned_url(r.resized_url)
                if r.resized_url else None
            )
            items.append(ClothingItem(
                id=str(r.id),
                image_url=signed_url,
                resized_url=resized_url,
                category=r.category,
                name=r.name,
                created_at=r.created_at
            ))
        return ClothingListResponse(clothes=items)

    # ✅ Get single clothing
    async def get_clothing_by_id(self, clothing_id: str, user) -> ClothingDetailResponse:
        r = await self.repo.get_clothing_by_id(clothing_id)
        if not r:
            raise NotFoundError("Clothing not found.")
        if str(r.user_id) != str(user.id):
            raise UnauthorizedError("Access denied.")

        return ClothingDetailResponse(
            id=str(r.id),
            image_url=await self.storage.get_presigned_url(r.image_url),
            resized_url=(
                await self.storage.get_presigned_url(r.resized_url)
                if r.resized_url else None
            ),
            category=r.category,
            name=r.name,
            created_at=r.created_at
        )

    # ✅ Delete clothing
    async def delete_clothing(self, clothing_id: str, user) -> ClothingDeleteResponse:
        r = await self.repo.get_clothing_by_id(clothing_id)
        if not r:
            raise NotFoundError("Clothing not found.")
        if str(r.user_id) != str(user.id):
            raise UnauthorizedError("Access denied.")

        await self.storage.delete_image_from_url(r.image_url)
        await self.repo.delete_clothing(clothing_id)

        return ClothingDeleteResponse(message="Clothing deleted successfully")

    # ✅ Update clothing
    async def update_clothing(self, clothing_id: str, payload: ClothingUpdate, user) -> ClothingDetailResponse:
        r = await self.repo.get_clothing_by_id(clothing_id)
        if not r:
            raise NotFoundError("Clothing not found.")
        if str(r.user_id) != str(user.id):
            raise UnauthorizedError("Access denied.")

        updated = await self.repo.update_clothing(clothing_id, payload)

        return ClothingDetailResponse(
            id=str(updated.id),
            image_url=await self.storage.get_presigned_url(updated.image_url),
            resized_url=(
                await self.storage.get_presigned_url(updated.resized_url)
                if updated.resized_url else None
            ),
            category=updated.category,
            name=updated.name,
            created_at=updated.created_at
        )

    # ✅ Get categories
    async def get_categories(self, user) -> CategoryListResponse:
        categories = await self.repo.get_user_categories(user.id)
        return CategoryListResponse(categories=categories)