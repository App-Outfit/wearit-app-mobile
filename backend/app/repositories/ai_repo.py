from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.tryon_history import TryOnHistory
from app.core.logging_config import logger
from datetime import datetime 
import uuid

class AIRepository:
    """Gestion des opérations liées aux Try-On dans PostgreSQL"""
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_tryon(self, user_id: str, body_id: str, cloth_id: str):
        """
        Vérifie si un try-on existe déjà pour ce user_id, body_id et cloth_id.
        """
        logger.info(f"🟡 [AIRepository] Querying try-on for user_id={user_id}, body_id={body_id}, cloth_id={cloth_id}")
        
        try:
            result = await self.db.execute(
                select(TryOnHistory).filter(
                    TryOnHistory.user_id == user_id,
                    TryOnHistory.body_id == body_id,
                    TryOnHistory.cloth_id == cloth_id
                )
            )
            tryon = result.scalars().first()
            if tryon:
                logger.info(f"🟢 [AIRepository] Try-on found: {tryon.id}")
            else:
                logger.warning(f"🔴 [AIRepository] No try-on found")
            return tryon
        
        except SQLAlchemyError as e:
            logger.error(f"🔴 [AIRepository] Database error while fetching try-on: {e}")
            return None

    async def save_tryon(self, user_id: str, body_id: str, cloth_id: str, image_url: str):
        """
        Sauvegarde un try-on généré avec son image résultante.
        """
        logger.info(f"🟡 [AIRepository] Saving new try-on for user_id={user_id}, body_id={body_id}, cloth_id={cloth_id}")

        new_tryon = TryOnHistory(
            id=uuid.uuid4(),
            user_id=user_id,
            body_image_id=body_id,
            cloth_id=cloth_id,
            tryon_image_url=image_url,
            created_at=datetime.now()
        )

        try:
            self.db.add(new_tryon)
            await self.db.commit()
            await self.db.refresh(new_tryon)
            logger.info(f"🟢 [AIRepository] Try-on saved successfully with ID: {new_tryon.id}")
            return new_tryon
        
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"🔴 [AIRepository] Failed to save try-on: {e}")
            return None
