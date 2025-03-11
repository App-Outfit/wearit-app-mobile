from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.user import User
from app.core.logging_config import logger

class AuthRepository:
    """Repository pour gérer les utilisateurs dans PostgreSQL"""
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, email: str, hashed_password: str, name: str):
        """Crée un nouvel utilisateur"""
        logger.info("🟡 [Repository] Inserting new user into PostgreSQL")

        new_user = User(email=email, password=hashed_password, name=name)

        try:
            self.db.add(new_user)
            await self.db.commit()
            await self.db.refresh(new_user)  # Rafraîchir pour récupérer l'ID
            logger.debug(f"🟢 [Repository] User {new_user.id} created successfully")
            return new_user
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"🔴 [Repository] Database error: {e}")
            return None

    async def get_user_by_email(self, email: str):
        """Récupère un utilisateur par email"""
        logger.info("🟡 [Repository] Getting user by email from PostgreSQL")

        try:
            result = await self.db.execute(select(User).filter(User.email == email))
            user = result.scalars().first()
            if user:
                logger.debug(f"🟢 [Repository] User {user.id} found")
            else:
                logger.warning(f"🔴 [Repository] User with email {email} not found")
            return user
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] Database error: {e}")
            return None
        
    async def delete_user_by_id(self, user_id: str):
        """Supprime un utilisateur par son ID."""
        try:
            # Utiliser la fonction delete() de SQLAlchemy
            await self.db.execute(delete(User).where(User.id == user_id))
            await self.db.commit()
            logger.debug(f"🟢 [Repository] User {user_id} deleted successfully")
            return True
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"🔴 [Repository] Failed to delete user: {e}")
            return False