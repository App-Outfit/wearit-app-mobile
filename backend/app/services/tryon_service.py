from typing import Any
from uuid import UUID
from fastapi import UploadFile

from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from app.api.schemas.tryon_schema import TryonResponse, TryonListResponse
from app.repositories.tryon_repo import TryonRepository
from app.repositories.storage_repo import StorageRepository
from app.services.preprocessing_service import PreprocessingService
from app.services.ai_service import AIService

class TryonService:
    def __init__(
        self,
        repository: TryonRepository,
        storage_repo: StorageRepository,
        preprocessing_service: PreprocessingService,
        ai_service: AIService,
    ):
        self.repo = repository
        self.storage = storage_repo
        self.preproc = preprocessing_service
        self.ai = ai_service

    async def create_tryon(self, body_id: str, cloth_id: str, user: Any) -> TryonResponse:
        # 1) fetch body & cloth
        try:
            body = await self.repo.get_body(body_id)
        except Exception:
            logger.exception("🔴 [Service] DB failure on get_body")
            raise InternalServerError("Failed to fetch body")
        if not body:
            logger.warning("🔴 [Service] Body %s not found", body_id)
            raise NotFoundError("Body not found")

        try:
            cloth = await self.repo.get_cloth(cloth_id)
        except Exception:
            logger.exception("🔴 [Service] DB failure on get_cloth")
            raise InternalServerError("Failed to fetch cloth")
        if not cloth:
            logger.warning("🔴 [Service] Cloth %s not found", cloth_id)
            raise NotFoundError("Cloth not found")

        # 2) cached?
        try:
            existing = await self.repo.get_tryon(user.id, body_id, cloth_id)
        except Exception:
            logger.exception("🔴 [Service] DB failure on get_tryon")
            raise InternalServerError("Failed to fetch previous try‑on")
        if existing:
            logger.info("🟢 [Service] Returning cached try‑on %s", existing.tryon_image_url)
            return TryonResponse(
                id=UUID(existing.id),
                body_id=UUID(existing.body_image_id),
                cloth_id=UUID(existing.cloth_id),
                image_url=str(existing.tryon_image_url),
            )

        # 3) masks
        try:
            masks = await self.preproc.get_preprocessed_body(body_id)
        except Exception:
            logger.exception("🔴 [Service] Preprocessing failure")
            raise InternalServerError("Failed to get body masks")
        mask_url = masks.get(cloth.type)
        if not mask_url:
            logger.error("🔴 [Service] No mask for type %s", cloth.type)
            raise InternalServerError("Missing body mask")

        # 4) generate via AI
        ai_input = {
            "user_id": user.id,
            "body_id": body_id,
            "cloth_id": cloth_id,
            "body_image_url": body.image_url,
            "cloth_image_url": cloth.image_url,
            "body_mask_url": mask_url,
        }
        try:
            return await self.ai.generate_tryon(ai_input)
        except Exception:
            logger.exception("🔴 [Service] AI generation failure")
            raise InternalServerError("Failed to generate try‑on")

    async def get_tryon_history(self, user: Any) -> TryonListResponse:
        try:
            records = await self.repo.get_tryon_history(user.id)
        except Exception:
            logger.exception("🔴 [Service] DB failure on get_tryon_history")
            raise InternalServerError("Failed to fetch try‑on history")
        if not records:
            logger.warning("🔴 [Service] No try‑on history for user %s", user.id)
            raise NotFoundError("No try‑on history found")
        return TryonListResponse(
            tryons=[
                TryonResponse(
                    id=UUID(r.id),
                    body_id=UUID(r.body_image_id),
                    cloth_id=UUID(r.cloth_id),
                    image_url=str(r.tryon_image_url),
                )
                for r in records
            ]
        )
