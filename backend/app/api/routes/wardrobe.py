from fastapi import APIRouter, Depends
from app.services.wardrobe_service import WardrobeService
from app.api.schemas.wardrobe import ClothResponse, ClothCreate, ClothCreateResponse
from app.core.logging_config import logger

router = APIRouter()

# GET a cloth by its ID
@router.get("/wardrobe/clothes/{cloth_id}", response_model=ClothResponse)
async def get_cloth(cloth_id: str, service: WardrobeService = Depends()):
    logger.info(f"🔵 [API] Received GET request for cloth_id: {cloth_id}")
    return await service.get_cloth_by_id(cloth_id)

# POST a new cloth
@router.post("/wardrobe/clothes", response_model=ClothCreateResponse)
async def create_cloth(cloth: ClothCreate, service: WardrobeService = Depends()):
    logger.info(f"🔵 [API] Received POST request to create a new cloth")
    return await service.create_cloth(cloth)
