from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.features.tryon.tryon_repo import TryonRepository
from .favorite_service import FavoriteService
from .favorite_repo import FavoriteRepository
from .favorite_schema import (
    FavoriteCreateRequest,
    FavoriteCheckRequest,
    FavoriteResponse,
    FavoriteListResponse,
    FavoriteCheckResponse,
    FavoriteDeleteResponse,
)
from app.infrastructure.database.dependencies import get_current_user, get_db

router = APIRouter(prefix="/favorites", tags=["Favorites"])

def get_favorite_service(db=Depends(get_db)):
    return FavoriteService(
        FavoriteRepository(db),
        BodyRepository(db),
        ClothingRepository(db),
        TryonRepository(db)
    )


@router.post("", response_model=FavoriteResponse)
async def add_favorite(
    payload: FavoriteCreateRequest,
    current_user = Depends(get_current_user),
    service: FavoriteService = Depends(get_favorite_service)
):
    logger.info(f"⭐ [API] POST /favorites — user_id={current_user.id}")
    return await service.add_favorite(current_user, payload)


@router.get("", response_model=FavoriteListResponse)
async def list_favorites(
    current_user = Depends(get_current_user),
    service: FavoriteService = Depends(get_favorite_service)
):
    logger.info(f"📄 [API] GET /favorites — user_id={current_user.id}")
    return await service.get_favorites(current_user)


@router.get("/{favorite_id}", response_model=FavoriteResponse)
async def get_favorite(
    favorite_id: str,
    current_user = Depends(get_current_user),
    service: FavoriteService = Depends(get_favorite_service)
):
    logger.info(f"👁️ [API] GET /favorites/{favorite_id} — user_id={current_user.id}")
    return await service.get_favorite_by_id(current_user, favorite_id)


@router.delete("/{favorite_id}", response_model=FavoriteDeleteResponse)
async def delete_favorite(
    favorite_id: str,
    current_user = Depends(get_current_user),
    service: FavoriteService = Depends(get_favorite_service)
):
    logger.info(f"🗑️ [API] DELETE /favorites/{favorite_id} — user_id={current_user.id}")
    return await service.delete_favorite(favorite_id, current_user)