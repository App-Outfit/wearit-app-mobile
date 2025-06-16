# app/features/body/body_repo.py

from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from app.core.errors import NotFoundError
from .body_model import BodyModel


class BodyRepository:
    def __init__(self, db: Database):
        self._col = db["bodies"]

    # ✅ Créer un nouveau body (status: pending)
    async def create_body(self, user_id: str, body_id: ObjectId, image_url: str) -> BodyModel:
        doc = {
            "_id": body_id,
            "user_id": user_id,
            "image_url": image_url,
            "mask_upper": None,
            "mask_lower": None,
            "mask_dress": None,
            "is_default": False,
            "status": "pending",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        await self._col.insert_one(doc)
        return BodyModel(**doc)

    # ✅ Met à jour les masques d’un body
    async def set_masks(self, body_id: str, masks: dict):
        update = {
            **masks,
            "status": "ready",
            "updated_at": datetime.now()
        }
        result = await self._col.update_one(
            {"_id": ObjectId(body_id)},
            {"$set": update}
        )
        if result.matched_count == 0:
            raise NotFoundError("Body not found")

    # ✅ Récupère tous les bodies d’un utilisateur
    async def get_all_bodies(self, user_id: str) -> List[BodyModel]:
        cursor = self._col.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
        docs = await cursor.to_list(length=None)
        return [BodyModel(**doc) for doc in docs]       

    # ✅ Récupère le dernier body d’un user
    async def get_latest_body(self, user_id: str) -> Optional[BodyModel]:
        doc = await self._col.find_one(
            {"user_id": ObjectId(user_id)},
            sort=[("created_at", -1)]
        )
        return BodyModel(**doc) if doc else None

    # ✅ Récupère un body par ID
    async def get_body_by_id(self, body_id: str) -> BodyModel:
        doc = await self._col.find_one({"_id": ObjectId(body_id)})
        if not doc:
            raise NotFoundError("Body not found")
        return BodyModel(**doc)
       
    # ✅ Met à jour le champ image_url d’un body
    async def update_body_image_url(self, body_id: str, new_image_url: str):
        update = {
            "image_url": new_image_url,
            "updated_at": datetime.now()
        }
        result = await self._col.update_one(
            {"_id": ObjectId(body_id)},
            {"$set": update}
        )
        if result.matched_count == 0:
            raise NotFoundError("Body not found")
