from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging_config import logger
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.tryon_history import TryOnHistory
from app.infrastructure.database.models.body_image import BodyImage
from app.infrastructure.database.models.cloth import Cloth

class TryonRepository:
    def __init__(self, db: AsyncSession):
        self.db_session = db
        
    async def get_body(self, body_id: str):
        #logger.info(f"🟡 [Repository] Querying PostgreSQL for body with body_id: {body_id}")
        try:
            result = await self.db_session.execute(select(BodyImage).where(BodyImage.id == body_id))
            body = result.scalars().first()
            if body:
                #logger.debug(f"🟢 [Repository] Body found")
                return body
            else:
                logger.warning(f"🔴 [Repository] Body not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_cloth(self, cloth_id: str):
        #logger.info(f"🟡 [Repository] Querying PostgreSQL for cloth with cloth_id: {cloth_id}")
        try:
            result = await self.db_session.execute(select(Cloth).where(Cloth.id == cloth_id))
            cloth = result.scalars().first()
            if cloth:
                #logger.debug(f"🟢 [Repository] Cloth found")
                return cloth
            else:
                logger.warning(f"🔴 [Repository] Cloth not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None

    async def get_tryon(self, user_id: str, body_id: str, cloth_id: str):
        logger.info(f"🟡 [Repository] Querying PostgreSQL for try-on with user_id: {user_id}, body_id: {body_id}, and cloth_id: {cloth_id}")
        try:
            result = await self.db_session.execute(
                select(TryOnHistory).where(
                    TryOnHistory.user_id == user_id,
                    TryOnHistory.body_image_id == body_id,
                    TryOnHistory.cloth_id == cloth_id
                )
            )
            tryon = result.scalars().first()
            if tryon:
                logger.debug(f"🟢 [Repository] Try-on found")
                return tryon
            else:
                logger.warning(f"🔴 [Repository] Try-on not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_tryon_history(self, user_id: str):
        logger.info(f"🟡 [Repository] Querying PostgreSQL for try-on history with user_id: {user_id}")
        try:
            result = await self.db_session.execute(select(TryOnHistory).where(TryOnHistory.user_id == user_id))
            tryons = result.scalars().all()
            if tryons:
                logger.debug(f"🟢 [Repository] Try-on history found")
                return tryons
            else:
                logger.warning(f"🔴 [Repository] Try-on history not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None