# app/features/tryon/tryon_route.py

from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from app.infrastructure.database.dependencies import get_current_user, get_db
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonDeleteResponse
)
from app.features.tryon.tryon_service import TryonService
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository

router = APIRouter(prefix="/tryon", tags=["Tryon"])

def get_service(db=Depends(get_db)):
    return TryonService(
        repo=TryonRepository(db),
        storage=StorageRepository(),
        body_repo=BodyRepository(db),
        clothing_repo=ClothingRepository(db)
    )

# ✅ Créer un tryon (body + vêtement)
@router.post("", response_model=TryonCreateResponse)
async def create_tryon(
    payload: TryonCreateRequest,
    current_user=Depends(get_current_user),
    service: TryonService = Depends(get_service)
):
    logger.info(f"🧪 Create tryon for user {current_user.id}")
    return await service.create_tryon(user=current_user, payload=payload)

# ✅ Obtenir tous les tryons de l'utilisateur
@router.get("", response_model=TryonListResponse)
async def get_all_tryons(
    current_user=Depends(get_current_user),
    service: TryonService = Depends(get_service)
):
    logger.info(f"📦 List tryons for user {current_user.id}")
    return await service.get_all_tryons(current_user.id)

# ✅ Obtenir un tryon par ID
@router.get("/{tryon_id}", response_model=TryonDetailResponse)
async def get_tryon_by_id(
    tryon_id: str,
    current_user=Depends(get_current_user),
    service: TryonService = Depends(get_service)
):
    logger.info(f"🔍 Get tryon {tryon_id} for user {current_user.id}")
    return await service.get_tryon_by_id(tryon_id, current_user)

# ✅ Supprimer un tryon
@router.delete("/{tryon_id}", response_model=TryonDeleteResponse)
async def delete_tryon(
    tryon_id: str,
    current_user=Depends(get_current_user),
    service: TryonService = Depends(get_service)
):
    logger.info(f"🗑️ Delete tryon {tryon_id} for user {current_user.id}")
    return await service.delete_tryon(tryon_id, current_user)