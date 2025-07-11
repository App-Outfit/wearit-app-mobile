from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from .fashion_product_repo import FashionProductRepository

class FashionProductService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = FashionProductRepository(db)

    async def list_products(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        category: Optional[str] = None,
        brand: Optional[str] = None,
        color: Optional[str] = None,
        gender: Optional[str] = None,
    ):
        filters: Dict[str, Any] = {}
        if category:
            filters["category_name"] = category
        if brand:
            filters["store_id"] = brand
        if color:
            filters["color_name"] = color
        if gender:
            filters["gender"] = gender
        return await self.repo.list_products(page=page, page_size=page_size, search=search, filters=filters)

    async def get_product_by_id(self, product_id: str):
        return await self.repo.get_product_by_id(product_id)

    async def get_filters(self):
        return {
            "brands": await self.repo.get_distinct_values("store_id"),
            "categories": await self.repo.get_distinct_values("category_name"),
            "colors": await self.repo.get_distinct_values("color_name"),
            "genders": await self.repo.get_distinct_values("gender"),
        }
