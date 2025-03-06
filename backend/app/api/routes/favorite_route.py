from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from app.services.favorite_service import FavoriteService
from app.repositories.favorite_repo import FavoriteRepository
from app.api.schemas.favorite_schema import FavoriteCreateResponse, FavoriteResponse, FavoriteListResponse, FavoriteDeleteResponse, FavoriteBase

router = APIRouter(prefix="/favorite", tags=["Favorite"])

from fastapi import Depends

def get_favorite_service(repo: FavoriteRepository = Depends()):
    return FavoriteService(repo)

# POST a new favorite (outfit = list of clothing items)
@router.post("/", response_model=FavoriteCreateResponse)
async def create_favorite(
    favorite: FavoriteBase,
    service: FavoriteService = Depends(get_favorite_service)
):
    logger.info(f"🔵 [API] Received POST request to create new favorite")
    return await service.create_favorite(favorite.model_dump())

# GET a favorite by its ID
@router.get("/{favorite_id}", response_model=FavoriteResponse)
async def get_favorite(favorite_id: str, service: FavoriteService = Depends(get_favorite_service)):
    logger.info(f"🔵 [API] Received GET request for favorite_id: {favorite_id}")
    return await service.get_favorite_by_id(favorite_id)

# DELETE a favorite by its ID
@router.delete("/{favorite_id}", response_model=FavoriteDeleteResponse)
async def delete_favorite(favorite_id: str, service: FavoriteService = Depends(get_favorite_service)):
    logger.info(f"🔵 [API] Received DELETE request for favorite_id: {favorite_id}")
    return await service.delete_favorite(favorite_id)

# GET a list of all favorites by user_id
@router.get("/list/{user_id}", response_model=FavoriteListResponse)
async def get_favorites(user_id: str, service: FavoriteService = Depends(get_favorite_service)):
    logger.info(f"🔵 [API] Received GET request for user_id: {user_id}")
    return await service.get_favorites(user_id)