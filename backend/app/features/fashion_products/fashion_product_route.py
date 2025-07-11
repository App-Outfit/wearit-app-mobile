from fastapi import APIRouter, Depends, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.infrastructure.database.dependencies import get_products_db
from .fashion_product_service import FashionProductService
from .fashion_product_schema import ProductListResponse, ProductFiltersResponse
from typing import Optional
from .fashion_product_model import FashionProduct

router = APIRouter(prefix="/fashion-products", tags=["Fashion Products"])

def get_fashion_product_service(db: AsyncIOMotorDatabase = Depends(get_products_db)):
    return FashionProductService(db)

@router.get("/", response_model=ProductListResponse)
async def list_fashion_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    service: FashionProductService = Depends(get_fashion_product_service),
):
    return await service.list_products(
        page=page,
        page_size=page_size,
        search=search,
        category=category,
        brand=brand,
        color=color,
        gender=gender,
    )

@router.get("/filters", response_model=ProductFiltersResponse)
async def get_fashion_product_filters(
    service: FashionProductService = Depends(get_fashion_product_service),
):
    return await service.get_filters()

@router.get("/{product_id}", response_model=FashionProduct)
async def get_fashion_product(
    product_id: str,
    service: FashionProductService = Depends(get_fashion_product_service),
):
    product = await service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
