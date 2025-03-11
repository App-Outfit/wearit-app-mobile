from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.body_image import BodyImage
from app.infrastructure.database.models.body_masks import BodyMasks
from app.core.logging_config import logger

class PreprocessingRepository:
    """Gère l'accès aux données pour le preprocessing des images de corps."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_body_masks(self, body_id: str):
        """
        Vérifie si des masques existent déjà pour un body donné.
        """
        logger.info(f"🟡 [Repository] Checking existing masks for body_id: {body_id}")

        try:
            query = select(BodyMasks).filter(BodyMasks.body_id == body_id)
            result = await self.db.execute(query)
            body_masks = result.scalars().first()

            if body_masks:
                logger.info(f"🟢 [Repository] Masks found for body_id: {body_id}")
            else:
                logger.warning(f"🔴 [Repository] No masks found for body_id: {body_id}")

            return body_masks
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] Database error while checking masks: {e}")
            return None

    async def get_body_image_url(self, body_id: str):
        """
        Récupère l'URL de l'image du body dans la base de données.
        """
        logger.info(f"🟡 [Repository] Fetching body image URL for body_id: {body_id}")

        try:
            query = select(BodyImage).filter(BodyImage.id == body_id)
            result = await self.db.execute(query)
            body_image = result.scalars().first()

            if body_image:
                logger.info(f"🟢 [Repository] Body image found: {body_image.image_url}")
            else:
                logger.warning(f"🔴 [Repository] No body image found for body_id: {body_id}")

            return body_image
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] Database error while fetching body image: {e}")
            return None

    async def save_body_masks(self, body_id: str, mask_urls: dict):
        """
        Sauvegarde les URLs des masques après preprocessing.
        """
        logger.info(f"🟡 [Repository] Saving masks for body_id: {body_id}")

        new_masks = BodyMasks(
            body_id=body_id,
            mask_upper=mask_urls["upper_mask_url"],
            mask_lower=mask_urls["lower_mask_url"],
            mask_overall=mask_urls["overall_mask_url"]
        )

        try:
            self.db.add(new_masks)
            await self.db.commit()
            logger.info(f"🟢 [Repository] Masks saved successfully for body_id: {body_id}")
            return new_masks
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"🔴 [Repository] Database error while saving masks: {e}")
            return None
