# app/services/ai_service.py

import asyncio
import uuid
from typing import Any

from app.repositories.ai_repo import AIRepository
from app.services.preprocessing_service import PreprocessingService
from app.core.errors import InternalServerError
from app.api.schemas.tryon_schema import TryonResponse
from app.core.logging_config import logger


class AIService:
    def __init__(
        self,
        ai_repo: AIRepository,
        preproc_svc: PreprocessingService,
    ):
        self.ai_repo = ai_repo
        self.preproc_svc = preproc_svc

    async def generate_tryon(self, ai_data: dict) -> TryonResponse:
        user_id = ai_data["user_id"]
        body_id = ai_data["body_id"]
        cloth_id = ai_data["cloth_id"]

        # 1) Peut-être un résultat en cache ?
        existing = await self.ai_repo.get_tryon(user_id, body_id, cloth_id)
        if existing:
            logger.info("🟢 [AIService] Returning cached try-on %s", existing.id)
            return TryonResponse(
                id=existing.id,
                body_id=existing.body_id,
                cloth_id=existing.cloth_id,
                image_url=existing.tryon_image_url,
            )

        # 2) Sinon, on génère
        try:
            logger.info("🚀 [AIService] Simulating AI call")
            img_url = await self._call_fake_ai(
                ai_data["body_image_url"],
                ai_data["cloth_image_url"],
                ai_data["body_mask_url"],
            )
        except Exception as e:
            logger.exception("🔴 [AIService] AI generation error")
            raise InternalServerError("Failed to generate try-on")

        # 3) On persiste
        new_tryon = await self.ai_repo.save_tryon(
            user_id=user_id,
            body_id=body_id,
            cloth_id=cloth_id,
            image_url=img_url,
        )

        logger.info("🟢 [AIService] Try-on saved with ID %s", new_tryon.id)
        return TryonResponse(
            id=new_tryon.id,
            body_id=new_tryon.body_id,
            cloth_id=new_tryon.cloth_id,
            image_url=new_tryon.tryon_image_url,
        )

    async def _call_fake_ai(
        self, body_image_url: str, cloth_image_url: str, body_mask_url: str
    ) -> str:
        if not (body_image_url and cloth_image_url and body_mask_url):
            logger.error("🔴 [AIService] Missing URLs for AI input")
            raise InternalServerError("Invalid AI input data")
        # Simule le travail du modèle
        await asyncio.sleep(0.5)
        fake_url = f"https://s3.fake-bucket.com/generated/{uuid.uuid4()}.jpg"
        logger.info("🟢 [AIService] Fake AI produced %s", fake_url)
        return fake_url
