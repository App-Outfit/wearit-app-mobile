from typing import Optional, List
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime

from app.core.errors import NotFoundError
from .tryon_model import TryonModel


class TryonRepository:
    def __init__(self, db: Database):
        self._col = db["tryons"]
        self._users = db["users"]

    async def create_tryon(
        self,
        tryon_id: ObjectId,
        user_id: str,
        body_id: str,
        clothing_id: str,
        version: int,
        created_at: datetime
    ) -> TryonModel:
        result = await self._users.find_one_and_update(
            {"_id": ObjectId(user_id), "credits": {"$gt": 0}},
            {"$inc": {"credits": -1}},
        )

        if not result:
            raise Exception("User has no credits left")
        
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
        await self._col.insert_one(doc)
        return TryonModel(**doc)
        
    async def set_tryon(self, tryon_id: str, s3_key: str):
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
        
    async def get_all_by_user(self, user_id: str) -> List[TryonModel]:
        """
        Renvoie, pour chaque paire (body_id, clothing_id), 
        uniquement le document ayant la version la plus élevée.
        """
        pipeline = [
            # 1) Ne garder que l'user
            {"$match": {"user_id": ObjectId(user_id)}},
            # 2) Trier version décroissante, fallback created_at
            {"$sort": {"version": -1, "created_at": -1}},
            # 3) Grouper par body+clothing et prendre le premier (max version)
            {"$group": {
                "_id": {
                    "body_id":     "$body_id",
                    "clothing_id": "$clothing_id",
                },
                "doc": {"$first": "$$ROOT"}
            }},
            # 4) Remplacer la racine par le document complet
            {"$replaceRoot": {"newRoot": "$doc"}}
        ]

        docs = await self._col.aggregate(pipeline).to_list(length=None)
        # Si ton TryonModel attend un champ output_url, assure son existence
        for doc in docs:
            doc.setdefault("output_url", None)
        return [TryonModel(**doc) for doc in docs]

    async def get_all_by_body_and_clothing(
        self,
        body_id: str,
        clothing_id: str
    ) -> List[TryonModel]:
        cursor = self._col.find({
            "body_id": ObjectId(body_id),
            "clothing_id": ObjectId(clothing_id)
        }).sort("created_at", 1)

        docs = await cursor.to_list(length=None)
        for doc in docs:
            doc.setdefault("output_url", None)
        return [TryonModel(**doc) for doc in docs]
    
    async def get_all_by_body(
        self,
        body_id: str
    ) -> List[TryonModel]:
        cursor = self._col.find({"body_id": ObjectId(body_id)}).sort("created_at", 1)

        docs = await cursor.to_list(length=None)
        for doc in docs:
            doc.setdefault("output_url", None)
        return [TryonModel(**doc) for doc in docs]


    async def get_tryon_by_id(self, tryon_id: str) -> Optional[TryonModel]:
        doc = await self._col.find_one({"_id": ObjectId(tryon_id)})
        return TryonModel(**doc) if doc else None

    async def delete_tryon(self, tryon_id: str) -> None:
        result = await self._col.delete_one({"_id": ObjectId(tryon_id)})
        if result.deleted_count == 0:
            raise NotFoundError("Tryon not found")