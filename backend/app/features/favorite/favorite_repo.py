from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from typing import Optional, List
from .favorite_model import FavoriteInDB


class FavoriteRepository:
    def __init__(self, db: Database):
        self._col = db["favorites"]

    async def create_favorite(
        self,
        user_id: str,
        body_id: str,
        clothing_ids: List[str],
        created_at: datetime,
        updated_at: datetime,
    ) -> FavoriteInDB:
        doc = {
            "_id": ObjectId(),
            "user_id": ObjectId(user_id),
            "body_id": ObjectId(body_id),
            "clothing_ids": [ObjectId(cid) for cid in clothing_ids],
            "created_at": created_at,
            "updated_at": updated_at,
        }
        await self._col.insert_one(doc)
        return FavoriteInDB(**doc)

    async def get_favorite_by_id(self, favorite_id: str) -> Optional[FavoriteInDB]:
        doc = await self._col.find_one({"_id": ObjectId(favorite_id)})
        return FavoriteInDB(**doc) if doc else None

    async def delete_favorite(self, favorite_id: str) -> bool:
        result = await self._col.delete_one({"_id": ObjectId(favorite_id)})
        return result.deleted_count == 1

    async def get_all_favorites(self, user_id: str) -> List[FavoriteInDB]:
        docs = await self._col.find({"user_id": ObjectId(user_id)}).to_list(length=None)
        return [FavoriteInDB(**doc) for doc in docs]

    async def find_favorite(self, user_id: str, body_id: str, clothing_ids: List[str]) -> Optional[FavoriteInDB]:
        query = {
            "user_id": ObjectId(user_id),
            "body_id": ObjectId(body_id),
            "clothing_ids": {"$all": [ObjectId(cid) for cid in clothing_ids]}
        }
        doc = await self._col.find_one(query)
        return FavoriteInDB(**doc) if doc else None
