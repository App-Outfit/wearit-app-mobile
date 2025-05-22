from bson import ObjectId
from datetime import datetime
from app.core.errors import UnauthorizedError
from .favorite_repo import FavoriteRepository
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.features.tryon.tryon_repo import TryonRepository
from .favorite_schema import (
    FavoriteCreateRequest,
    FavoriteResponse,
    FavoriteListResponse,
    FavoriteDeleteResponse,
)

class FavoriteService:
    def __init__(
        self,
        repo: FavoriteRepository,
        body_repo: BodyRepository,
        clothing_repo: ClothingRepository,
        tryon_repo: TryonRepository
    ):
        self.repo = repo
        self.body_repo = body_repo
        self.clothing_repo = clothing_repo
        self.tryon_repo = tryon_repo

    # ✅ Ajouter un favori
    async def add_favorite(self, user, payload: FavoriteCreateRequest) -> FavoriteResponse:
        body = await self.body_repo.get_body_by_id(payload.body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("Invalid body")

        for clothing_id in payload.clothing_ids:
            clothing = await self.clothing_repo.get_clothing_by_id(clothing_id)
            if not clothing or str(clothing.user_id) != str(user.id):
                raise UnauthorizedError("Invalid clothing")

        now = datetime.now()
        doc = await self.repo.create_favorite(
            user_id=user.id,
            body_id=payload.body_id,
            clothing_ids=payload.clothing_ids,
            created_at=now,
            updated_at=now
        )

        return FavoriteResponse(
            id=str(doc.id),
            body_id=str(doc.body_id),
            clothing_ids=[str(cid) for cid in doc.clothing_ids],
            created_at=doc.created_at,
            updated_at=doc.updated_at
        )

    # ✅ Supprimer un favori
    async def delete_favorite(self, favorite_id: str, user) -> FavoriteDeleteResponse:
        fav = await self.repo.get_favorite_by_id(favorite_id)
        if not fav or str(fav.user_id) != str(user.id):
            raise UnauthorizedError("Access denied")

        await self.repo.delete_favorite(favorite_id)
        return FavoriteDeleteResponse(message="Favorite removed")

    # ✅ Lister les favoris
    async def get_favorites(self, user) -> FavoriteListResponse:
        records = await self.repo.get_all_favorites(user.id)
        return FavoriteListResponse(
            favorites=[
                FavoriteResponse(
                    id=str(fav.id),
                    body_id=str(fav.body_id),
                    clothing_ids=[str(cid) for cid in fav.clothing_ids],
                    created_at=fav.created_at,
                    updated_at=fav.updated_at
                ) for fav in records
            ]
        )

    # ✅ Vérifier si un outfit est déjà en favori
    async def get_favorite_by_id(self, user, favorite_id: str) -> FavoriteResponse:
        fav = await self.repo.get_favorite_by_id(favorite_id)
        if not fav or str(fav.user_id) != str(user.id):
            raise UnauthorizedError("Access denied")

        return FavoriteResponse(
            id=str(fav.id),
            body_id=str(fav.body_id),
            clothing_ids=[str(cid) for cid in fav.clothing_ids],
            created_at=fav.created_at,
            updated_at=fav.updated_at
        )