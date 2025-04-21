from typing import Optional, List
from pymongo.errors import PyMongoError
from pymongo.database import Database
from pydantic import BaseModel
from datetime import datetime

from app.core.errors import InternalServerError
from app.core.logging_config import logger

class TryonRecord(BaseModel):
    id: str
    user_id: str
    body_image_id: str
    cloth_id: str
    tryon_image_url: str
    created_at: datetime

class TryonRepository:
    def __init__(self, db: Database):
        self._col = db["tryons"]

    async def get_body(self, body_id: str) -> Optional[TryonRecord]:
        try:
            doc = await self._col.database["bodies"].find_one({"_id": body_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch body")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        # on ne convertit qu’aux champs utiles
        return TryonRecord(
            id=body_id,
            user_id=doc["user_id"],
            body_image_id=doc["_id"],
            cloth_id="",          # pas utilisé ici
            tryon_image_url="",   # pas utilisé ici
            created_at=doc["created_at"],
        )

    async def get_cloth(self, cloth_id: str) -> Optional[TryonRecord]:
        try:
            doc = await self._col.database["clothes"].find_one({"_id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch cloth")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return TryonRecord(
            id=cloth_id,
            user_id=doc["user_id"],
            body_image_id="",     # pas utilisé ici
            cloth_id=doc["_id"],
            tryon_image_url="",   # pas utilisé ici
            created_at=doc["created_at"],
        )

    async def get_tryon(
        self, user_id: str, body_id: str, cloth_id: str
    ) -> Optional[TryonRecord]:
        try:
            doc = await self._col.find_one({
                "user_id": user_id,
                "body_image_id": body_id,
                "cloth_id": cloth_id,
            })
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch try‑on")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return TryonRecord(**doc)

    async def get_tryon_history(self, user_id: str) -> List[TryonRecord]:
        try:
            cursor = self._col.find({"user_id": user_id})
            docs = await cursor.to_list(length=None)
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch try‑on history")
            raise InternalServerError("Database failure")
        return [TryonRecord(**d) for d in docs]
