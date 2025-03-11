import httpx
import asyncio
from app.repositories.storage_repo import StorageRepository
from app.repositories.preprocessing_repo import PreprocessingRepository
from app.core.logging_config import logger
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

class PreprocessingService:
    """Service pour gérer la récupération et la génération des masques d'un body"""

    def __init__(self, db: AsyncSession):
        self.repository = PreprocessingRepository(db)
        self.storage_repo = StorageRepository()

    async def get_preprocessed_body(self, body_id: UUID):
        """
        Vérifie si les masques existent déjà. Sinon, les génère via l'API de preprocessing (ou un fake).
        """
        logger.info(f"🟡 [Preprocessing] Checking for existing masks for body_id: {body_id}")

        # 1️⃣ Vérifier si les masques existent déjà
        body_masks = await self.repository.get_body_masks(body_id)
        if body_masks:
            logger.info(f"🟢 [Preprocessing] Masks found for body_id: {body_id}")
            return {
                "upper": body_masks.mask_upper,
                "lower": body_masks.mask_lower,
                "overall": body_masks.mask_overall
            }

        # 2️⃣ Récupérer l'URL de l'image originale sur S3
        body_image = await self.repository.get_body_image_url(body_id)
        if not body_image:
            logger.error(f"🔴 [Preprocessing] Body image not found for body_id: {body_id}")
            raise Exception("Body image not found")

        # 3️⃣ Simuler l'appel à l'API de preprocessing
        logger.warning(f"🔴 [Preprocessing] No masks found, simulating preprocessing API call")
        mask_urls = await self.fake_preprocessing_api(body_image.image_url)

        # 4️⃣ Sauvegarder les URLs des masques en base
        saved_masks = await self.repository.save_body_masks(body_id, mask_urls)

        logger.info(f"🟢 [Preprocessing] Masks successfully processed and stored for body_id: {body_id}")
        return {
            "upper": saved_masks.mask_upper,
            "lower": saved_masks.mask_lower,
            "overall": saved_masks.mask_overall
        }

    async def fake_preprocessing_api(self, image_url: str):
        """
        Simule un appel à l'API de preprocessing en générant des URLs factices après 0.5 seconde de délai.
        """
        logger.info(f"🟡 [Fake Preprocessing] Simulating API call for image: {image_url}")

        # Simuler un délai de traitement de 0.5 seconde
        await asyncio.sleep(0.5)

        # Générer de fausses URLs
        mask_urls = {
            "upper_mask_url": f"{image_url.replace('.jpg', '_upper_mask.jpg')}",
            "lower_mask_url": f"{image_url.replace('.jpg', '_lower_mask.jpg')}",
            "overall_mask_url": f"{image_url.replace('.jpg', '_overall_mask.jpg')}",
        }

        logger.info(f"🟢 [Fake Preprocessing] Generated fake mask URLs: {mask_urls}")
        return mask_urls
    
    # async def call_preprocessing_api(self, image_url: str):
    #     """
    #     Appelle l'API de preprocessing pour générer les masques d'un body.
    #     """
    #     preprocessing_api_url = "https://api.my-preprocessing.com/process"

    #     async with httpx.AsyncClient() as client:
    #         response = await client.post(preprocessing_api_url, json={"image_url": image_url})

    #         if response.status_code != 200:
    #             logger.error(f"🔴 [Preprocessing] Error calling API: {response.status_code}, {response.text}")
    #             raise Exception("Failed to process body")

    #         mask_data = response.json()
    #         logger.info(f"🟢 [Preprocessing] Received mask URLs from API")

    #         return {
    #             "upper_mask_url": mask_data["upper_mask_url"],
    #             "lower_mask_url": mask_data["lower_mask_url"],
    #             "full_mask_url": mask_data["full_mask_url"]
    #         }