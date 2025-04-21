from fastapi import APIRouter, Depends, UploadFile, File
from uuid import UUID

from app.core.logging_config import logger
from app.core.config import settings
from app.api.dependencies import get_current_user, get_db
from app.services.body_service import BodyService
from app.repositories.body_repo import BodyRepository
from app.api.schemas.body_schema import (
    BodyCreate, BodyCreateResponse,
    BodyResponse, BodyListResponse, BodyDeleteResponse
)

router = APIRouter(prefix="/body", tags=["Body"])

def get_body_service(db=Depends(get_db)) -> BodyService:
    """
    Injector : on injecte la session SQLAlchemy dans le repository,
    et on crée le service avec le repo + le storage par défaut.
    """
    repo = BodyRepository(db)
    return BodyService(repository=repo)

@router.post(
    "/",
    response_model=BodyCreateResponse,
    summary="Upload a new body image and create a record"
)
async def create_body(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    logger.info("🔵 [API] POST /body – create_body for user %s", current_user.id)
    # On construit notre DTO Pydantic depuis l'UploadFile
    body_dto = BodyCreate(user_id=current_user.id, file=file)
    return await service.create_body(body_dto)

@router.get(
    "/{body_id}",
    response_model=BodyResponse,
    summary="Retrieve a single body by its ID"
)
async def get_body(
    body_id: UUID,
    service: BodyService = Depends(get_body_service)
):
    logger.info("🔵 [API] GET /body/%s", body_id)
    return await service.get_body_by_id(str(body_id))

@router.get(
    "/",
    response_model=BodyListResponse,
    summary="List all bodies of the current user"
)
async def list_bodies(
    current_user=Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    logger.info("🔵 [API] GET /body/ – list bodies for user %s", current_user.id)
    return await service.get_bodies(current_user.id)

@router.delete(
    "/{body_id}",
    response_model=BodyDeleteResponse,
    summary="Delete a body image by its ID"
)
async def delete_body(
    body_id: UUID,
    service: BodyService = Depends(get_body_service)
):
    logger.info("🔵 [API] DELETE /body/%s", body_id)
    return await service.delete_body(str(body_id))
