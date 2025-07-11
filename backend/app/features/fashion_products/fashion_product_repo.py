from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING
from .fashion_product_model import FashionProduct
from bson import ObjectId

class FashionProductRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["fashion_products"]
        print(f"[DEBUG] Connected to DB: {self.collection.database.name}, Collection: {self.collection.name}")

    async def list_products(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "_id",
        sort_dir: int = DESCENDING,
    ) -> Dict[str, Any]:
        query = filters or {}
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"product_name": {"$regex": search, "$options": "i"}},
                {"store_id": {"$regex": search, "$options": "i"}},
                {"category_name": {"$regex": search, "$options": "i"}},
            ]
        print(f"[DEBUG] Query used: {query}")
        total = await self.collection.count_documents(query)
        print(f"[DEBUG] Total documents matching query: {total}")
        cursor = (
            self.collection.find(query)
            .sort(sort_by, sort_dir)
            .skip((page - 1) * page_size)
            .limit(page_size)
        )
        products = [FashionProduct(**{**doc, "_id": str(doc["_id"])}) async for doc in cursor]
        print(f"[DEBUG] Products returned: {len(products)}")
        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "products": products,
        }

    async def get_product_by_id(self, product_id: str) -> Optional[FashionProduct]:
        doc = await self.collection.find_one({"_id": ObjectId(product_id)})
        if doc:
            return FashionProduct(**{**doc, "_id": str(doc["_id"])})
        return None

    async def get_distinct_values(self, field: str) -> List[str]:
        return await self.collection.distinct(field)
