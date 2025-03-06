from fastapi import APIRouter, Depends
from app.services.wardrobe_service import WardrobeService
from app.repositories.wardrobe_repo import WardrobeRepository
from app.api.schemas.wardrobe_schema import ClothResponse, ClothCreateResponse, ClothListResponse, ClothDeleteResponse
from app.core.logging_config import logger
from fastapi import Form, UploadFile, File

router = APIRouter()

from fastapi import Depends

def get_wardrobe_service(repo: WardrobeRepository = Depends()):
    return WardrobeService(repo)

# POST a new cloth
@router.post("/wardrobe/clothes", response_model=ClothCreateResponse)
async def create_cloth(
    user_id: str = Form(...),  # 🔥 FormData pour envoyer du texte
    name: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...),  # 🔥 File pour envoyer une image
    service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received POST request to create a new cloth")
    cloth_data = {
        "user_id": user_id,
        "name": name,
        "type": type,
        "file": file
    }
    return await service.create_cloth(cloth_data)

# GET a cloth by its ID
@router.get("/wardrobe/clothes/{cloth_id}", response_model=ClothResponse)
async def get_cloth(cloth_id: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received GET request for cloth_id: {cloth_id}")
    return await service.get_cloth_by_id(cloth_id)

# Get a list of all clothes by user_id and type
@router.get("/wardrobe/clothes", response_model=ClothListResponse)
async def get_clothes(user_id: str, cloth_type: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received GET request for user_id: {user_id} and type: {cloth_type}")
    return await service.get_clothes(user_id, cloth_type)

# DELETE a cloth by its ID
@router.delete("/wardrobe/clothes/{cloth_id}", response_model=ClothDeleteResponse)
async def delete_cloth(cloth_id: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received DELETE request for cloth_id: {cloth_id}")
    return await service.delete_cloth(cloth_id)