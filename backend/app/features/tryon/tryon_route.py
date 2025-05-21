from fastapi import APIRouter, Depends
from uuid import UUID

from app.infrastructure.database.dependencies import get_current_user, get_db
from app.core.logging_config import logger
from app.features.tryon.tryon_schema import TryonResponse, TryonListResponse
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.features.tryon.tryon_service import TryonService

router = APIRouter(prefix="/tryon", tags=["Try-on"])

def get_tryon_service(db=Depends(get_db)) -> TryonService:
    return TryonService(
        repository=TryonRepository(db),
        storage_repo=StorageRepository(),
    )

@router.get("/{body_id}/{cloth_id}", response_model=TryonResponse)
async def create_tryon(
    body_id: UUID,
    cloth_id: UUID,
    current_user=Depends(get_current_user),
    service=Depends(get_tryon_service),
):
    logger.info("🔵 [API] GET /tryon/%s/%s", body_id, cloth_id)
    return await service.create_tryon(str(body_id), str(cloth_id), current_user)

@router.get("/history", response_model=TryonListResponse)
async def get_tryon_history(
    current_user=Depends(get_current_user),
    service=Depends(get_tryon_service),
):
    logger.info("🔵 [API] GET /tryon/history for user %s", current_user.id)
    return await service.get_tryon_history(current_user)
