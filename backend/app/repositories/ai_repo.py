# app/repositories/ai_repo.py

from typing import Optional
from datetime import datetime
import uuid

from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from app.core.errors import InternalServerError
from app.core.logging_config import logger


class TryOnInDB(BaseModel):
    id: str
    user_id: str
    body_id: str
    cloth_id: str
    tryon_image_url: str
    created_at: datetime


class AIRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self._col = db["tryon_history"]

    async def get_tryon(
        self, user_id: str, body_id: str, cloth_id: str
    ) -> Optional[TryOnInDB]:
        try:
            doc = await self._col.find_one({
                "user_id": user_id,
                "body_id": body_id,
                "cloth_id": cloth_id,
            })
        except Exception as e:
            logger.exception("🔴 [AIRepo] MongoDB read error for try-on")
            raise InternalServerError("Database failure when fetching try-on")
        if not doc:
            return None
        doc["id"] = str(doc["_id"])
        return TryOnInDB(**doc)

    async def save_tryon(
        self, user_id: str, body_id: str, cloth_id: str, image_url: str
    ) -> TryOnInDB:
        now = datetime.utcnow()
        to_insert = {
            "user_id": user_id,
            "body_id": body_id,
            "cloth_id": cloth_id,
            "tryon_image_url": image_url,
            "created_at": now,
        }
        try:
            res = await self._col.insert_one(to_insert)
        except Exception as e:
            logger.exception("🔴 [AIRepo] MongoDB write error for try-on")
            raise InternalServerError("Database failure when saving try-on")
        to_insert["id"] = str(res.inserted_id)
        return TryOnInDB(**to_insert)
