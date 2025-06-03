from fastapi import APIRouter, Depends, UploadFile, Query
from typing import Optional
from app.core.logging_config import logger
from .clothing_service import ClothingService
from .clothing_schema import (
    ClothingUploadResponse, ClothingItem, ClothingListResponse,
    ClothingDetailResponse, ClothingDeleteResponse,
    ClothingUpdate, CategoryListResponse
)
from app.infrastructure.database.dependencies import get_current_user, get_db
from .clothing_repo import ClothingRepository

router = APIRouter(prefix="/clothing", tags=["Clothing"])

def get_service(db=Depends(get_db)):
    return ClothingService(ClothingRepository(db))


# ✅ Upload clothing
@router.post("/upload", response_model=ClothingUploadResponse)
async def upload_clothing(
    category: str = Query(..., description="Clothing category (e.g., shirt, pants)"),
    cloth_type: str = Query(..., description="Type of clothing (e.g., upper, lower, dress)"),
    name: Optional[str] = Query(None, description="Optional name"),
    file: UploadFile = ...,
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"📤 Upload clothing for user {current_user.id}")
    return await service.upload_clothing(current_user, file, category, cloth_type, name)


# ✅ Get all clothing (with optional category)
@router.get("", response_model=ClothingListResponse)
async def get_clothes(
    category: Optional[str] = Query(None, description="Optional category filter"),
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"👕 List clothes for user {current_user.id} with category={category}")
    return await service.get_clothes(current_user, category)


# ✅ Get categories used by the user
@router.get("/categories", response_model=CategoryListResponse)
async def get_categories(
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"📚 List clothing categories for user {current_user.id}")
    return await service.get_categories(current_user)


# ✅ Get one clothing by ID
@router.get("/{clothing_id}", response_model=ClothingDetailResponse)
async def get_clothing_by_id(
    clothing_id: str,
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"🔍 Get clothing {clothing_id} for user {current_user.id}")
    return await service.get_clothing_by_id(clothing_id, current_user)


# ✅ Delete clothing
@router.delete("/{clothing_id}", response_model=ClothingDeleteResponse)
async def delete_clothing(
    clothing_id: str,
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"🗑️ Delete clothing {clothing_id} for user {current_user.id}")
    return await service.delete_clothing(clothing_id, current_user)


# ✅ Update clothing (optional)
@router.patch("/{clothing_id}", response_model=ClothingDetailResponse)
async def update_clothing(
    clothing_id: str,
    payload: ClothingUpdate,
    current_user = Depends(get_current_user),
    service: ClothingService = Depends(get_service)
):
    logger.info(f"✏️ Update clothing {clothing_id} for user {current_user.id}")
    return await service.update_clothing(clothing_id, payload, current_user)