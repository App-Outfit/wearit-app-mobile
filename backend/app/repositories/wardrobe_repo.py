from typing import Optional, List
from datetime import datetime
from pymongo.errors import PyMongoError
from pymongo.database import Database
from pydantic import BaseModel
from app.core.errors import InternalServerError
from app.core.logging_config import logger

class ClothInDB(BaseModel):
    id: str
    user_id: str
    name: str
    type: str
    image_url: str
    created_at: datetime

class WardrobeRepository:
    def __init__(self, db: Database):
        self._col = db["clothes"]

    async def create_cloth(
        self,
        cloth_id: str,
        user_id: str,
        name: str,
        type: str,
        image_url: str,
        created_at: datetime,
    ) -> ClothInDB:
        doc = {
            "_id": cloth_id,
            "user_id": user_id,
            "name": name,
            "type": type,
            "image_url": image_url,
            "created_at": created_at,
        }
        try:
            await self._col.insert_one(doc)
            return ClothInDB(
                id=cloth_id,
                user_id=user_id,
                name=name,
                type=type,
                image_url=image_url,
                created_at=created_at,
            )
        except PyMongoError:
            logger.exception("🔴 [Repository] MongoDB insert error")
            raise InternalServerError("Unable to create cloth")

    async def get_cloth_by_id(self, cloth_id: str) -> Optional[ClothInDB]:
        try:
            doc = await self._col.find_one({"_id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] MongoDB find error")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return ClothInDB(
            id=str(doc["_id"]),
            user_id=doc["user_id"],
            name=doc["name"],
            type=doc["type"],
            image_url=doc["image_url"],
            created_at=doc["created_at"],
        )

    async def get_clothes(self, user_id: str, cloth_type: str) -> List[ClothInDB]:
        try:
            cursor = self._col.find({
                "user_id": user_id,
                "type": cloth_type
            })
            docs = await cursor.to_list(length=None)
        except PyMongoError:
            logger.exception("🔴 [Repository] MongoDB find error")
            raise InternalServerError("Database failure")
        return [
            ClothInDB(
                id=str(d["_id"]),
                user_id=d["user_id"],
                name=d["name"],
                type=d["type"],
                image_url=d["image_url"],
                created_at=d["created_at"],
            ) for d in docs
        ]

    async def delete_cloth(self, cloth_id: str) -> bool:
        try:
            result = await self._col.delete_one({"_id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] MongoDB delete error")
            raise InternalServerError("Unable to delete cloth")
        return result.deleted_count == 1
