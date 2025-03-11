from app.repositories.ai_repo import AIRepository
from app.services.preprocessing_service import PreprocessingService
from app.core.errors import InternalServerError
from app.api.schemas.tryon_schema import TryonResponse
from uuid import UUID
import uuid
import asyncio
from app.core.logging_config import logger

class AIService:
    def __init__(self, db):
        self.repository = AIRepository(db)
        self.preprocessing_service = PreprocessingService(db)

    async def generate_tryon(self, ai_data: dict):
        logger.info(f"🚀 [AIService] Calling AI to generate try-on")

        body_image_url = ai_data.get("body_image_url")
        cloth_image_url = ai_data.get("cloth_image_url")
        body_mask_url = ai_data.get("body_mask_url")

        tryon_image_url = await self.call_fake_ai(body_image_url, cloth_image_url, body_mask_url)
        if not tryon_image_url:
            logger.error(f"🔴 [AIService] Failed to generate try-on")
            raise InternalServerError("Failed to generate try-on")

        logger.info(f"🟢 [AIService] Try-on generated successfully")
        
        new_tryon = await self.repository.save_tryon(
            user_id=ai_data.get("user_id"),
            body_id=ai_data.get("body_id"),
            cloth_id=ai_data.get("cloth_id"),
            image_url=tryon_image_url
        )

        if not new_tryon:
            logger.error(f"🔴 [AIService] Failed to save try-on")
            raise InternalServerError("Failed to save try-on")
        
        logger.info(f"🟢 [AIService] Try-on created and saved with ID: {new_tryon.id}")

        return TryonResponse(
            id=new_tryon.id,
            body_id=ai_data.get("body_id"),
            cloth_id=ai_data.get("cloth_id"),
            image_url=tryon_image_url
        )
    
    async def call_fake_ai(self, body_image_url: str, cloth_image_url: str, body_mask_url: str):
        """
        Simulation d'un appel à un modèle IA qui génère un try-on.
        """
        logger.info(f"🤖 [AIService] Simulating AI call for try-on generation...")
        await asyncio.sleep(0.5)  # Simule un délai de traitement

        # Génération d'une fausse URL d'image
        fake_image_url = f"https://s3.fake-bucket.com/generated/{uuid.uuid4()}.jpg"

        logger.info(f"🟢 [AIService] Fake AI generation complete: {fake_image_url}")
        return fake_image_url
        

        