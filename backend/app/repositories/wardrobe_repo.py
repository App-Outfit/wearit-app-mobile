from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from app.infrastructure.database.models.cloth import Cloth
from app.core.logging_config import logger
from app.infrastructure.database.models.user import User
from fastapi import HTTPException

class WardrobeRepository:
    def __init__(self, db: AsyncSession):
        self.db_session = db    

    async def create_cloth(self, cloth: dict):
        """Insère un nouveau vêtement dans la base PostgreSQL."""
        logger.info("🟡 [Repository] Inserting new cloth into PostgreSQL")

        async with self.db_session as session:
            try:
                # ✅ Vérifier si l'utilisateur existe
                result = await session.execute(select(User).filter(User.id == cloth["user_id"]))
                user = result.scalars().first()
                if not user:
                    logger.warning(f"🔴 [Repository] User {cloth['user_id']} not found")
                    raise HTTPException(status_code=404, detail="User not found")

                # ✅ Créer et insérer l'habit
                new_cloth = Cloth(**cloth)
                session.add(new_cloth)
                await session.commit()
                await session.refresh(new_cloth)  # Récupère l'objet après insertion

                logger.info(f"🟢 [Repository] Cloth {new_cloth.id} inserted successfully")
                return new_cloth.id

            except SQLAlchemyError as e:
                await session.rollback()  # Annule la transaction en cas d'erreur
                logger.error(f"🔴 [Repository] An error occurred: {e}")
                raise HTTPException(status_code=500, detail="Database error")

    async def get_cloth_by_id(self, cloth_id: str):
        """Récupère un vêtement par son ID."""
        logger.info(f"🟡 [Repository] Querying PostgreSQL for cloth_id: {cloth_id}")
        try:
            result = await self.db_session.execute(select(Cloth).where(Cloth.id == cloth_id))
            cloth = result.scalars().first()
            print(cloth)
            if cloth:
                logger.debug(f"🟢 [Repository] Cloth {cloth_id} found")
                return cloth
            else:
                logger.warning(f"🔴 [Repository] Cloth {cloth_id} not found")
                return None
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_clothes(self, user_id: str, cloth_type: str):
        """Récupère tous les vêtements d'un utilisateur en fonction du type."""
        logger.info(f"🟡 [Repository] Querying PostgreSQL for user_id: {user_id} and type: {cloth_type}")
        try:
            result = await self.db_session.execute(
                select(Cloth).where(Cloth.user_id == user_id, Cloth.type == cloth_type)
            )
            clothes = result.scalars().all()
            return clothes
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def delete_cloth(self, cloth_id: str):
        """Supprime un vêtement par son ID."""
        logger.info(f"🟡 [Repository] Deleting cloth {cloth_id} from PostgreSQL")
        try:
            result = await self.db_session.execute(select(Cloth).where(Cloth.id == cloth_id))
            cloth = result.scalars().first()

            if not cloth:
                logger.warning(f"🔴 [Repository] Cloth {cloth_id} not found")
                return False

            await self.db_session.delete(cloth)
            await self.db_session.commit()
            logger.debug(f"🟢 [Repository] Cloth {cloth_id} deleted")
            return True
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return False