# app/repositories/wardrobe_repo.py

from typing import Optional, List
from datetime import datetime
from pymongo.errors import PyMongoError
from pymongo.database import Database
from pydantic import BaseModel
from app.core.errors import InternalServerError, NotFoundError
from app.core.logging_config import logger

class ClothInDB(BaseModel):
    id: str
    user_id: str
    name: str
    type: str
    image_url: str       # <— doit correspondre au champ en base
    tags: List[str]
    created_at: datetime

class OutfitInDB(BaseModel):
    id: str
    user_id: str
    body_id: str
    cloth_ids: List[str]
    created_at: datetime


class WardrobeRepository:
    def __init__(self, db: Database):
        self._clothes = db["clothes"]
        self._outfits = db["outfits"]
        self._categories = db["categories"]

    # ----- Cloth CRUD -----

    async def create_cloth(
        self,
        cloth_id: str,
        user_id: str,
        name: str,
        type: str,
        image_url: str,
        tags: List[str],
        created_at: datetime,
    ) -> ClothInDB:
        doc = {
            "_id": cloth_id,
            "user_id": user_id,
            "name": name,
            "type": type,
            "image_url": image_url,
            "tags": tags,
            "created_at": created_at,
        }
        try:
            await self._clothes.insert_one(doc)
            return ClothInDB(**{**doc, "id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to create cloth")
            raise InternalServerError("Unable to create cloth")

    async def get_cloth_by_id(self, cloth_id: str) -> Optional[ClothInDB]:
        try:
            doc = await self._clothes.find_one({"_id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch cloth")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return ClothInDB(**{**doc, "id": str(doc["_id"])})

    async def get_clothes(self, user_id: str, cloth_type: str) -> List[ClothInDB]:
        try:
            # On ne charge que les champs dont on a besoin
            docs = await self._clothes.find(
                {"user_id": user_id, "type": cloth_type},
                projection={
                    "_id": 1,
                    "user_id": 1,
                    "name": 1,
                    "type": 1,
                    "image_url": 1,
                    "tags": 1,
                    "created_at": 1,
                }
            ).to_list(length=None)
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to list clothes")
            raise InternalServerError("Database failure")

        clothes: List[ClothInDB] = []
        for d in docs:
            clothes.append(ClothInDB(
                id=str(d["_id"]),            # transforme ObjectId/UUID en str
                user_id=d["user_id"],
                name=d["name"],
                type=d["type"],
                image_url=d["image_url"],
                tags=d.get("tags", []),
                created_at=d["created_at"],
            ))
        return clothes

    async def delete_cloth(self, cloth_id: str) -> bool:
        try:
            res = await self._clothes.delete_one({"_id": cloth_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to delete cloth")
            raise InternalServerError("Database failure")
        return res.deleted_count == 1
    
    # ----- Categories CRUD -----

    async def create_category(self, user_id: str, name: str, id: str) -> dict:
        doc = {
            "_id": id,
            "user_id": user_id,
            "name": name,
            "created_at": datetime.now(),
        }
        res = await self._categories.insert_one(doc)
        doc["_id"] = str(res.inserted_id)
        return doc
    
    async def list_categories(self, user_id: str) -> List[dict]:
        cursor = self._categories.find(
            {"user_id": user_id},
            projection={"_id": 1, "name": 1, "created_at": 1}
        )
        docs = await cursor.to_list(length=None)
        return [{"id": str(d["_id"]), "name": d["name"], "created_at": d["created_at"]} for d in docs]
    
    async def exists_category(self, user_id: str, category_name: str) -> bool:
        doc = await self._categories.find_one(
            {"name": category_name, "user_id": user_id},
            projection={"_id": 1}
        )
        return doc is not None
    
    # ----- Outfit CRUD -----

    async def create_outfit(
        self,
        outfit_id: str,
        user_id: str,
        body_id: str,
        cloth_ids: List[str],
        created_at: datetime,
    ) -> OutfitInDB:
        doc = {
            "_id": outfit_id,
            "user_id": user_id,
            "body_id": body_id,
            "cloth_ids": cloth_ids,
            "created_at": created_at,
        }
        try:
            await self._outfits.insert_one(doc)
            return OutfitInDB(**{**doc, "id": outfit_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to create outfit")
            raise InternalServerError("Unable to create outfit")

    async def get_outfit_by_id(self, outfit_id: str) -> Optional[OutfitInDB]:
        try:
            doc = await self._outfits.find_one({"_id": outfit_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to fetch outfit")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return OutfitInDB(**{**doc, "id": str(doc["_id"])})

    async def get_outfits(self, user_id: str) -> List[OutfitInDB]:
        try:
            docs = await self._outfits.find({"user_id": user_id}).to_list(length=None)
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to list outfits")
            raise InternalServerError("Database failure")
        return [OutfitInDB(**{**d, "id": str(d["_id"])}) for d in docs]

    async def delete_outfit(self, outfit_id: str) -> bool:
        try:
            res = await self._outfits.delete_one({"_id": outfit_id})
        except PyMongoError:
            logger.exception("🔴 [Repository] Failed to delete outfit")
            raise InternalServerError("Database failure")
        return res.deleted_count == 1
