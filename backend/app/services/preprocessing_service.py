# app/services/preprocessing_service.py

import asyncio
from typing import Dict
from uuid import UUID

from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from app.repositories.preprocessing_repo import PreprocessingRepository


class PreprocessingService:
    def __init__(self, repository: PreprocessingRepository):
        self.repo = repository

    async def get_preprocessed_body(self, body_id: UUID) -> Dict[str, str]:
        body_id_str = str(body_id)
        logger.info("🟡 [Preproc] Checking masks for body_id=%s", body_id_str)

        # 1) Existe déjà ?
        maybe = await self.repo.get_body_masks(body_id_str)
        if maybe:
            logger.info("🟢 [Preproc] Masks found for %s", body_id_str)
            return {
                "upper": maybe.mask_upper,
                "lower": maybe.mask_lower,
                "overall": maybe.mask_overall,
            }

        # 2) Récupérer l'URL de l'image
        body_image = await self.repo.get_body_image_url(body_id_str)
        if not body_image:
            logger.error("🔴 [Preproc] Body image missing for %s", body_id_str)
            raise NotFoundError(f"Body image not found for {body_id_str}")

        # 3) Génération factice
        mask_urls = await self._fake_preprocessing_api(body_image.image_url)

        # 4) Sauvegarde
        saved = await self.repo.save_body_masks(body_id_str, mask_urls)
        logger.info("🟢 [Preproc] Masks saved for %s", body_id_str)
        return {
            "upper": saved.mask_upper,
            "lower": saved.mask_lower,
            "overall": saved.mask_overall,
        }

    async def _fake_preprocessing_api(self, image_url: str) -> Dict[str, str]:
        logger.info("🟡 [FakePreproc] Simulating for %s", image_url)
        await asyncio.sleep(0.5)
        if not image_url:
            logger.error("🔴 [FakePreproc] Invalid image URL")
            raise InternalServerError("Invalid image URL")
        return {
            "upper_mask_url": image_url.replace(".jpg", "_upper_mask.jpg"),
            "lower_mask_url": image_url.replace(".jpg", "_lower_mask.jpg"),
            "overall_mask_url": image_url.replace(".jpg", "_overall_mask.jpg"),
        }
