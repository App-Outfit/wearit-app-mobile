from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile
from uuid import UUID

from app.core.logging_config import logger
from app.infrastructure.database.dependencies import get_current_user, get_db
from app.features.clothing.wardrobe_service import WardrobeService
from app.features.clothing.wardrobe_repo import WardrobeRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.features.clothing.wardrobe_schema import (
    ClothCreate, ClothCreateResponse,
    ClothResponse, ClothListResponse, ClothDeleteResponse,
    OutfitCreate, OutfitCreateResponse,
    OutfitResponse, OutfitListResponse, OutfitDeleteResponse,
    CategoryResponse, CategoryListResponse
)

router = APIRouter(prefix="/wardrobe", tags=["Wardrobe"])

def get_wardrobe_service(db = Depends(get_db)) -> WardrobeService:
    return WardrobeService(
        repository=WardrobeRepository(db),
        storage_repo=StorageRepository()
    )

# --- Cloth Endpoints ---

@router.post("/", response_model=ClothCreateResponse)
async def create_cloth(
    name: str = Form(...),
    type: str = Form(...),
    tags: List[str] = Form([]),
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] POST /wardrobe")
    dto = ClothCreate(
        user_id=current_user.id,
        name=name,
        type=type,
        tags=tags
    )
    return await service.create_cloth(dto, file)

@router.get("/cloth/{cloth_id}", response_model=ClothResponse)
async def get_cloth(
    cloth_id: UUID,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] GET /wardrobe/cloth/%s", cloth_id)
    return await service.get_cloth_by_id(str(cloth_id))

@router.get("/clothes/{cloth_type}", response_model=ClothListResponse)
async def list_clothes(
    cloth_type: str,
    current_user = Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info(
        "🔵 [API] GET /wardrobe/clothes/%s for user %s",
        cloth_type, current_user.id,
    )
    return await service.get_clothes(current_user.id, cloth_type)

@router.delete("/{cloth_id}", response_model=ClothDeleteResponse)
async def delete_cloth(
    cloth_id: UUID,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] DELETE /wardrobe/%s", cloth_id)
    return await service.delete_cloth(str(cloth_id))

@router.post("/category", response_model=CategoryResponse)
async def create_category(
    name: str = Form(...),
    current_user=Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    """
    Crée une nouvelle catégorie vide pour l'utilisateur.
    """
    return await service.create_category(current_user.id, name)

@router.get("/categories", response_model=CategoryListResponse)
async def list_categories(
    current_user=Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    """
    Liste toutes les catégories de l'utilisateur.
    """
    return await service.list_categories(current_user.id)

# --- Outfit Endpoints ---

@router.post("/outfits", response_model=OutfitCreateResponse)
async def create_outfit(
    body_id: UUID = Form(...),
    cloth_ids: List[UUID] = Form(...),
    current_user = Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] POST /wardrobe/outfits")
    dto = OutfitCreate(
        user_id=current_user.id,
        body_id=body_id,
        cloth_ids=cloth_ids
    )
    return await service.create_outfit(dto)

@router.get("/outfits/{outfit_id}", response_model=OutfitResponse)
async def get_outfit(
    outfit_id: UUID,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] GET /wardrobe/outfits/%s", outfit_id)
    return await service.get_outfit_by_id(str(outfit_id))

@router.get("/outfits", response_model=OutfitListResponse)
async def list_outfits(
    current_user = Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] GET /wardrobe/outfits for user %s", current_user.id)
    return await service.get_outfits(current_user.id)

@router.delete("/outfits/{outfit_id}", response_model=OutfitDeleteResponse)
async def delete_outfit(
    outfit_id: UUID,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] DELETE /wardrobe/outfits/%s", outfit_id)
    return await service.delete_outfit(str(outfit_id))