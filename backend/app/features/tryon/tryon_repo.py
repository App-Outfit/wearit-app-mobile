from typing import Optional, List
from pymongo.errors import PyMongoError
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime

from app.core.logging_config import logger
from app.core.errors import InternalServerError, NotFoundError
from .tryon_model import TryonModel


class TryonRepository:
    def __init__(self, db: Database):
        self._col = db["tryons"]

    async def create_tryon(
        self,
        tryon_id: ObjectId,
        user_id: str,
        body_id: str,
        clothing_id: str,
        version: int,
        created_at: datetime
    ) -> TryonModel:
        doc = {
            "_id": tryon_id,
            "user_id": ObjectId(user_id),
            "body_id": ObjectId(body_id),
            "clothing_id": ObjectId(clothing_id),
            "version": version,
            "status": "pending",
            "created_at": created_at,
            "updated_at": created_at,
        }
        try:
            await self._col.insert_one(doc)
            return TryonModel(**doc)
        except PyMongoError:
            logger.exception("❌ MongoDB insert error (tryon)")
            raise InternalServerError("Unable to create tryon")
        
    async def set_tryon(self, tryon_id: str, s3_key: str):
        try:
            result = await self._col.update_one(
                {"_id": ObjectId(tryon_id)},
                {
                    "$set": {
                        "status": "ready",
                        "output_url": s3_key,
                        "updated_at": datetime.now()
                    }
                }
            )
            if result.matched_count == 0:
                raise NotFoundError("Tryon to update not found")
        except PyMongoError:
            logger.exception("❌ MongoDB update error (tryon ready)")
            raise InternalServerError("Unable to update tryon status")
        
    async def get_all_by_user(self, user_id: str) -> List[TryonModel]:
        try:
            cursor = self._col.find({"user_id": ObjectId(user_id)})
            docs = await cursor.to_list(length=None)
            return [
                TryonModel(**doc)
                for doc in docs
            ]

        except PyMongoError:
            logger.exception("❌ MongoDB fetch error (tryons by user)")
            raise InternalServerError("Unable to fetch tryons")

    async def get_all_by_body_and_clothing(
        self,
        body_id: str,
        clothing_id: str
    ) -> List[TryonModel]:
        """
        Renvoie la liste de tous les tryons pour une paire (body, clothing),
        en garantissant que chaque doc a bien un 'version', 'output_url' et 'status'.
        """
        try:
            cursor = self._col.find({
                "body_id": ObjectId(body_id),
                "clothing_id": ObjectId(clothing_id)
            }).sort("created_at", 1)
            docs = await cursor.to_list(length=None)

            for doc in docs:
                doc.setdefault("output_url", None)

            return [TryonModel(**doc) for doc in docs]

        except PyMongoError:
            logger.exception("❌ MongoDB fetch error (tryons by body+clothing)")
            raise InternalServerError("Unable to fetch tryons for versioning")


    async def get_tryon_by_id(self, tryon_id: str) -> Optional[TryonModel]:
        try:
            doc = await self._col.find_one({"_id": ObjectId(tryon_id)})
            return TryonModel(**doc) if doc else None
        except PyMongoError:
            logger.exception("❌ MongoDB fetch error (by tryon_id)")
            raise InternalServerError("Unable to fetch tryon")

    async def delete_tryon(self, tryon_id: str) -> None:
        try:
            result = await self._col.delete_one({"_id": ObjectId(tryon_id)})
            if result.deleted_count == 0:
                raise NotFoundError("Tryon not found")
        except PyMongoError:
            logger.exception("❌ MongoDB delete error (tryon)")
            raise InternalServerError("Failed to delete tryon")