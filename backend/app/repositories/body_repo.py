from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from pymongo.errors import PyMongoError
from pydantic import BaseModel
from app.core.errors import InternalServerError
from app.core.logging_config import logger

class BodyInDB(BaseModel):
    id: str
    user_id: str
    image_url: str
    created_at: datetime

class BodyRepository:
    def __init__(self, db: Database):
        self._col = db["bodies"]

    async def create_body(
        self,
        body_id: str,
        user_id: str,
        image_url: str,
        created_at: datetime,
    ) -> BodyInDB:
        doc = {
            "_id": body_id,
            "user_id": user_id,
            "image_url": image_url,
            "created_at": created_at,
        }
        try:
            await self._col.insert_one(doc)
            return BodyInDB(
                id=body_id,
                user_id=user_id,
                image_url=image_url,
                created_at=created_at,
            )
        except PyMongoError as e:
            logger.exception("🔴 [Repository] MongoDB insert error")
            raise InternalServerError("Unable to create body")

    async def get_body_by_id(self, body_id: str) -> Optional[BodyInDB]:
        try:
            doc = await self._col.find_one({"_id": body_id})
        except PyMongoError as e:
            logger.exception("🔴 [Repository] MongoDB find error")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return BodyInDB(
            id=str(doc["_id"]),
            user_id=doc["user_id"],
            image_url=doc["image_url"],
            created_at=doc["created_at"],
        )

    async def get_bodies(self, user_id: str) -> List[BodyInDB]:
        try:
            cursor = self._col.find({"user_id": user_id})
            docs = await cursor.to_list(length=None)
        except PyMongoError as e:
            logger.exception("🔴 [Repository] MongoDB find error")
            raise InternalServerError("Database failure")
        return [
            BodyInDB(
                id=str(d["_id"]),
                user_id=d["user_id"],
                image_url=d["image_url"],
                created_at=d["created_at"],
            ) for d in docs
        ]

    async def delete_body(self, body_id: str) -> bool:
        try:
            result = await self._col.delete_one({"_id": body_id})
        except PyMongoError as e:
            logger.exception("🔴 [Repository] MongoDB delete error")
            raise InternalServerError("Unable to delete body")
        return result.deleted_count == 1
