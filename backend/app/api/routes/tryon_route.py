from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.postgres import get_db
from app.core.logging_config import logger
from app.services.tryon_service import TryonService
from app.repositories.tryon_repo import TryonRepository
from app.api.dependencies import get_current_user
from uuid import UUID
from app.api.schemas.tryon_schema import TryonResponse, TryonListResponse

# 📌 Définition du router
router = APIRouter(prefix="/tryon", tags=["Try-on"])

def get_tryon_service(db: AsyncSession = Depends(get_db)):
    return TryonService(db)

# ✅ GET - Faire un essayage virtuel
@router.get("/{body_id}/{cloth_id}", response_model=TryonResponse)
async def create_tryon(
    body_id: UUID,
    cloth_id: UUID,
    current_user = Depends(get_current_user),
    service: TryonService = Depends(get_tryon_service)):
    logger.info(f"🔵 [API] Received GET request with body_id: {body_id}, and cloth_id: {cloth_id}")

    return await service.create_tryon(body_id, cloth_id, current_user)

# ✅ GET - Récupérer l'historique des essayages
@router.get("/history", response_model=TryonListResponse)
async def get_tryon_history(
    current_user = Depends(get_current_user),
    service: TryonService = Depends(get_tryon_service)):
    logger.info(f"🔵 [API] Received GET request to fetch try-on history")
    return await service.get_tryon_history(current_user)