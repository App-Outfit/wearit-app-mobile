# app/repositories/preprocessing_repo.py

from typing import Optional, Dict
from datetime import datetime

from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.core.errors import InternalServerError
from app.core.logging_config import logger


class BodyMasksInDB(BaseModel):
    id: str  # str(self._id)
    body_id: str
    mask_upper: str
    mask_lower: str
    mask_overall: str
    created_at: datetime


class BodyImageInDB(BaseModel):
    id: str
    image_url: str
    created_at: datetime


class PreprocessingRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        # collections MongoDB
        self._masks_col = db["body_masks"]
        self._images_col = db["body_images"]

    async def get_body_masks(self, body_id: str) -> Optional[BodyMasksInDB]:
        try:
            doc = await self._masks_col.find_one({"body_id": body_id})
        except Exception as e:
            logger.exception("🔴 [Repo] MongoDB error reading body_masks")
            raise InternalServerError("Database failure when checking masks")
        if not doc:
            return None
        # Pydantic attend un champ 'id'
        doc["id"] = str(doc["_id"])
        return BodyMasksInDB(**doc)

    async def get_body_image_url(self, body_id: str) -> Optional[BodyImageInDB]:
        try:
            doc = await self._images_col.find_one({"id": body_id})
        except Exception as e:
            logger.exception("🔴 [Repo] MongoDB error reading body_images")
            raise InternalServerError("Database failure when fetching body image")
        if not doc:
            return None
        return BodyImageInDB(**doc)

    async def save_body_masks(
        self, body_id: str, mask_urls: Dict[str, str]
    ) -> BodyMasksInDB:
        now = datetime.utcnow()
        to_insert = {
            "body_id": body_id,
            "mask_upper": mask_urls["upper_mask_url"],
            "mask_lower": mask_urls["lower_mask_url"],
            "mask_overall": mask_urls["overall_mask_url"],
            "created_at": now,
        }
        try:
            res = await self._masks_col.insert_one(to_insert)
        except Exception as e:
            logger.exception("🔴 [Repo] MongoDB error inserting body_masks")
            raise InternalServerError("Database failure when saving masks")
        to_insert["id"] = str(res.inserted_id)
        return BodyMasksInDB(**to_insert)
