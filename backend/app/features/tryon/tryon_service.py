from bson import ObjectId
import asyncio
from datetime import datetime
from app.core.logging_config import logger
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonItem, TryonDeleteResponse
)
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.core.errors import NotFoundError, UnauthorizedError


class TryonService:
    def __init__(
        self,
        repo: TryonRepository,
        storage: StorageRepository,
        body_repo: BodyRepository,
        clothing_repo: ClothingRepository
    ):
        self.repo = repo
        self.storage = storage
        self.body_repo = body_repo
        self.clothing_repo = clothing_repo

    async def create_tryon(self, user, payload: TryonCreateRequest) -> TryonCreateResponse:
        body_id = payload.body_id
        clothing_id = payload.clothing_id

        body = await self.body_repo.get_body_by_id(body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("Invalid body")

        cloth = await self.clothing_repo.get_clothing_by_id(clothing_id)
        if not cloth or str(cloth.user_id) != str(user.id):
            raise UnauthorizedError("Invalid clothing")

        existing = await self.repo.get_all_by_body_and_clothing(body_id, clothing_id)
        version = len(existing) + 1

        tryon_id = ObjectId()
        now = datetime.now()

        record = await self.repo.create_tryon(
            tryon_id=tryon_id,
            user_id=user.id,
            body_id=body_id,
            clothing_id=clothing_id,
            version=version,
            created_at=now
        )

        asyncio.create_task(self._simulate_ia(user.id, body_id, tryon_id, clothing_id))

        return TryonCreateResponse(
            tryon_id=str(record.id),
            created_at=record.created_at,
            message="Tryon created",
            status=record.status,
            version=version
        )

    async def _simulate_ia(self, user_id: str, body_id: str, tryon_id: str, clothing_id: str):
        logger.info(f"🤖 [IA] Simulating tryon {body_id} x {clothing_id}")
        await asyncio.sleep(4)

        s3_key = StoragePathBuilder.tryon(user_id, body_id, tryon_id)

        await self.repo.set_tryon(tryon_id, s3_key)
        logger.info(f"✅ [IA] Fake output stored at {s3_key}")

    async def get_all_tryons(self, user_id: str) -> TryonListResponse:
        docs = await self.repo.get_all_by_user(user_id)
        tryons = []
        for doc in docs:
            if doc.output_url:
                url = await self.storage.get_presigned_url(doc.output_url)
            else:
                url = None
            tryons.append(TryonItem(
                id=str(doc.id),
                output_url=url,
                body_id=str(doc.body_id),
                clothing_id=str(doc.clothing_id),
                status=doc.status,
                created_at=doc.created_at,
                version=doc.version
            ))
        return TryonListResponse(tryons=tryons)

    async def get_tryon_by_id(self, tryon_id: str, user) -> TryonDetailResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise NotFoundError("Tryon not found")

        url = await self.storage.get_presigned_url(doc.output_url)
        return TryonDetailResponse(
            id=str(doc.id),
            output_url=url,
            body_id=str(doc.body_id),
            clothing_id=str(doc.clothing_id),
            status=doc.status,
            version=doc.version,
            created_at=doc.created_at,
            updated_at=doc.updated_at
        )

    async def delete_tryon(self, tryon_id: str, user) -> TryonDeleteResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this tryon")

        await self.storage.delete_image(doc.output_url)
        await self.repo.delete_tryon(tryon_id)
        logger.info(f"🗑️ Deleted tryon {tryon_id}")
        return TryonDeleteResponse(message="Tryon deleted")
