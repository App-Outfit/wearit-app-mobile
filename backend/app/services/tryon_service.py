from app.repositories.tryon_repo import TryonRepository
from app.repositories.storage_repo import StorageRepository
from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from app.api.schemas.tryon_schema import TryonResponse, TryonListResponse
from app.services.preprocessing_service import PreprocessingService
from app.services.ai_service import AIService
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

class TryonService:
    def __init__(self, db: AsyncSession):
        self.repository = TryonRepository(db)
        self.storage_repo = StorageRepository()
        self.preprocessing_service = PreprocessingService(db)
        self.ai_service = AIService(db)

    async def create_tryon(self, body_id: str, cloth_id: str, current_user):
        body = await self.repository.get_body(body_id)
        if not body:
            logger.error(f"🔴 [Service] Body not found")
            raise NotFoundError("Body not found")

        cloth = await self.repository.get_cloth(cloth_id)
        if not cloth:
            logger.error(f"🔴 [Service] Cloth not found")
            raise NotFoundError("Cloth not found")
                
        logger.info(f"🟡 [Service] Checking existing try-on for body_id={body_id} and cloth_id={cloth_id}")
        tryon = await self.repository.get_tryon(current_user.id, body_id, cloth_id)

        if tryon:
            logger.info(f"🟢 [Service] Try-on found, returning cached result {tryon.tryon_image_url}")
            return TryonResponse(
                id=tryon.id,
                body_id=tryon.body_image_id,
                cloth_id=tryon.cloth_id,
                image_url=str(tryon.tryon_image_url)
            )     
        
        # 📌 Vérification des masks
        body_masks = await self.preprocessing_service.get_preprocessed_body(body_id)
        if not body_masks:
            logger.error(f"🔴 [Service] Failed to get body masks")
            raise InternalServerError("Failed to get body masks")

        # 🏷️ Sélection du bon mask en fonction du type de cloth
        selected_mask = body_masks.get(cloth.type)

        if not selected_mask:
            logger.error(f"🔴 [Service] No valid mask found")
            raise InternalServerError(f"Missing masks for body {body_id}")

        ai_input = {
            "user_id": current_user.id,
            "body_id": body_id,
            "cloth_id": cloth_id,
            "body_image_url": body.image_url,
            "cloth_image_url": cloth.image_url,
            "body_mask_url": selected_mask,
        }
        
        return await self.ai_service.generate_tryon(ai_input)
    
    async def get_tryon_history(self, current_user):
        logger.info(f"🟡 [Service] Fetching try-on history for user {current_user.id}")
        tryons = await self.repository.get_tryon_history(current_user.id)

        if not tryons:
            logger.warning(f"🔴 [Service] No try-on history found for user {current_user.id}")
            raise NotFoundError(f"No try-on history found for user {current_user.id}")
        
        logger.debug(f"🟢 [Service] Try-on history found for user {current_user.id}")
        return TryonListResponse(tryons=[
            TryonResponse(
                id=tryon.id,
                body_id=tryon.body_image_id,
                cloth_id=tryon.cloth_id,
                image_url=str(tryon.tryon_image_url)
            ) for tryon in tryons
        ])