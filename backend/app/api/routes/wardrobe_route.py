from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.wardrobe_service import WardrobeService
from app.infrastructure.database.postgres import get_db
from app.api.schemas.wardrobe_schema import ClothCreate, ClothResponse, ClothCreateResponse, ClothListResponse, ClothDeleteResponse
from app.core.logging_config import logger
from app.repositories.wardrobe_repo import WardrobeRepository

# 📌 Définition du router
router = APIRouter(prefix="/wardrobe", tags=["Wardrobe"])

def get_wardrobe_service(db: AsyncSession = Depends(get_db)):
    return WardrobeService(repository=WardrobeRepository(db))

# ✅ POST - Ajouter un vêtement
@router.post("/", response_model=ClothCreateResponse)
async def create_cloth(
    user_id: str = Form(...),  
    name: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...),  
    service: WardrobeService = Depends(get_wardrobe_service)
):
    logger.info(f"🔵 [API] Received POST request to create a new cloth")

    cloth_data = ClothCreate(
        user_id=user_id,
        name=name,
        type=type,
        file=file
    )

    return await service.create_cloth(cloth_data)

# ✅ GET - Récupérer un vêtement par ID
@router.get("/cloth/{cloth_id}", response_model=ClothResponse)
async def get_cloth(cloth_id: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received GET request for cloth_id: {cloth_id}")
    return await service.get_cloth_by_id(cloth_id)

# ✅ GET - Récupérer tous les vêtements d’un utilisateur selon le type
@router.get("/clothes/{user_id}/{cloth_type}", response_model=ClothListResponse)
async def get_clothes(user_id: str, cloth_type: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received GET request for user_id: {user_id} and type: {cloth_type}")
    return await service.get_clothes(user_id, cloth_type)

# ✅ DELETE - Supprimer un vêtement
@router.delete("/{cloth_id}", response_model=ClothDeleteResponse)
async def delete_cloth(cloth_id: str, service: WardrobeService = Depends(get_wardrobe_service)):
    logger.info(f"🔵 [API] Received DELETE request for cloth_id: {cloth_id}")
    return await service.delete_cloth(cloth_id)