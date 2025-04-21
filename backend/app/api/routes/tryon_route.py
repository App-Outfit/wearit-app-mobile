from fastapi import APIRouter, Depends
from uuid import UUID

from app.api.dependencies import get_current_user, get_db
from app.core.logging_config import logger
from app.api.schemas.tryon_schema import TryonResponse, TryonListResponse
from app.repositories.tryon_repo import TryonRepository
from app.repositories.storage_repo import StorageRepository
from app.services.preprocessing_service import PreprocessingService
from app.services.ai_service import AIService
from app.services.tryon_service import TryonService

router = APIRouter(prefix="/tryon", tags=["Try-on"])

def get_tryon_service(db=Depends(get_db)) -> TryonService:
    return TryonService(
        repository=TryonRepository(db),
        storage_repo=StorageRepository(),
        preprocessing_service=PreprocessingService(db),
        ai_service=AIService(db),
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
