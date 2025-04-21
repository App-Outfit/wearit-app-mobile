from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.core.logging_config import logger
from app.api.dependencies import get_current_user, get_db
from app.services.wardrobe_service import WardrobeService
from app.repositories.wardrobe_repo import WardrobeRepository
from app.repositories.storage_repo import StorageRepository
from app.api.schemas.wardrobe_schema import (
    ClothCreate, ClothCreateResponse,
    ClothResponse, ClothListResponse, ClothDeleteResponse
)

router = APIRouter(prefix="/wardrobe", tags=["Wardrobe"])

def get_wardrobe_service(db=Depends(get_db)) -> WardrobeService:
    return WardrobeService(
        repository=WardrobeRepository(db),
        storage_repo=StorageRepository()
    )

@router.post("/", response_model=ClothCreateResponse)
async def create_cloth(
    name: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] POST /wardrobe")
    dto = ClothCreate(
        user_id=current_user.id,
        name=name,
        type=type,
        file=file
    )
    return await service.create_cloth(dto)

@router.get("/cloth/{cloth_id}", response_model=ClothResponse)
async def get_cloth(
    cloth_id: str,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] GET /wardrobe/cloth/%s", cloth_id)
    return await service.get_cloth_by_id(cloth_id)

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
    cloth_id: str,
    service: WardrobeService = Depends(get_wardrobe_service),
):
    logger.info("🔵 [API] DELETE /wardrobe/%s", cloth_id)
    return await service.delete_cloth(cloth_id)
