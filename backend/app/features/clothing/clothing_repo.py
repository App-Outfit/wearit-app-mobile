from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from pymongo.errors import PyMongoError
from typing import Optional, List

from app.core.errors import InternalServerError
from .clothing_model import ClothingModel
from .clothing_schema import ClothingUpdate
from app.core.logging_config import logger


class ClothingRepository:
    def __init__(self, db: Database):
        self._col = db["clothing"]

    async def create_clothing(self, user_id: str, clothing_id: str, image_url: str, category: str, name: Optional[str], created_at: datetime) -> ClothingModel:
        doc = {
            "_id": ObjectId(clothing_id),
            "user_id": ObjectId(user_id),
            "image_url": image_url,
            "resized_url": None,
            "category": category,
            "cloth_type": "dress",
            "name": name,
            "created_at": created_at,
            "updated_at": created_at,
        }
        await self._col.insert_one(doc)
        return ClothingModel(**doc)

    async def get_clothes(self, user_id: str, category: Optional[str] = None) -> List[ClothingModel]:
        query = {"user_id": ObjectId(user_id)}
        if category:
            query["category"] = category
        docs = await self._col.find(query).to_list(length=None)
        return [ClothingModel(**doc) for doc in docs]

    async def get_clothing_by_id(self, clothing_id: str) -> Optional[ClothingModel]:
        doc = await self._col.find_one({"_id": ObjectId(clothing_id)})
        return ClothingModel(**doc) if doc else None

    async def delete_clothing(self, clothing_id: str) -> bool:
        result = await self._col.delete_one({"_id": ObjectId(clothing_id)})
        return result.deleted_count == 1

    async def update_clothing(self, clothing_id: str, payload: ClothingUpdate) -> ClothingModel:
        update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        updated = await self._col.find_one_and_update(
            {"_id": ObjectId(clothing_id)},
            {"$set": update_data},
            return_document=True
        )
        if not updated:
            raise InternalServerError("Clothing not found or update failed")
        return ClothingModel(**updated)

    async def get_user_categories(self, user_id: str) -> List[str]:
        return await self._col.distinct("category", {"user_id": ObjectId(user_id)})