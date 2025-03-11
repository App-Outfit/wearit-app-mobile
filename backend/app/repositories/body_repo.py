from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging_config import logger
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.body_image import BodyImage
from app.infrastructure.database.models.user import User


class BodyRepository:
    def __init__(self, db: AsyncSession):
        self.db_session = db
        
    async def create_body(self, body: dict):
        logger.info(f"🟡 [Repository] Inserting new body into MongoDB")
        try:
            result = await self.db_session.execute(select(User).filter(User.id == body["user_id"]))
            user = result.scalars().first()
            if not user:
                logger.warning(f"🔴 [Repository] User {body['user_id']} not found")
                return None
            
            new_body = BodyImage(**body)
            self.db_session.add(new_body)
            await self.db_session.commit()
            await self.db_session.refresh(new_body)

            logger.info(f"🟢 [Repository] Body {new_body.id} inserted successfully")
            return new_body.id
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_body_by_id(self, body_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for body_id: {body_id}")
        try:
            result = await self.db_session.execute(select(BodyImage).where(BodyImage.id == body_id))
            body = result.scalars().first()
            if body:
                logger.debug(f"🟢 [Repository] Body {body_id} found")
                return body
            else:
                logger.warning(f"🔴 [Repository] Body {body_id} not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_bodies(self, user_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for user_id: {user_id}")
        try:
            result = await self.db_session.execute(select(BodyImage).where(BodyImage.user_id == user_id))
            bodies = result.scalars().all()
            if bodies:
                logger.debug(f"🟢 [Repository] Bodies found for user {user_id}")
                return bodies
            else:
                logger.warning(f"🔴 [Repository] No bodies found for user {user_id}")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None    
        
    async def delete_body(self, body_id: str):
        logger.info(f"🟡 [Repository] Deleting body {body_id} from MongoDB")
        try:
            result = await self.db_session.execute(select(BodyImage).where(BodyImage.id == body_id))
            body = result.scalars().first()

            if not body:
                logger.warning(f"🔴 [Repository] Body {body_id} not found")
                return False

            await self.db_session.delete(body)
            await self.db_session.commit()
            logger.info(f"🟢 [Repository] Body {body_id} deleted successfully")
            return True
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return False