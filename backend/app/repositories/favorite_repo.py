from app.infrastructure.database.mongodb import MongoDB
from app.core.logging_config import logger
from app.repositories.wardrobe_repo import WardrobeRepository
from bson import ObjectId

class FavoriteRepository:
    def __init__(self, db=None):
        self.db = db if db is not None else MongoDB().get_database()
        self.wardrobe_repo = WardrobeRepository(self.db)

    async def create_favorite(self, favorite: dict):
        logger.info(f"🟡 [Repository] Inserting new favorite into MongoDB")
        try:
            collection = self.db.favorites
            result = await collection.insert_one(favorite)
            return result.inserted_id
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_favorite_by_id(self, favorite_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for favorite_id: {favorite_id}")
        try:
            collection = self.db.favorites
            favorite = await collection.find_one({"_id": ObjectId(favorite_id)})

            if favorite:
                logger.debug(f"🟢 [Repository] Favorite {favorite_id} found")
                return favorite
            else:
                logger.warning(f"🔴 [Repository] Favorite {favorite_id} not found")
                return None
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_favorites(self, user_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for user_id: {user_id}")
        try:
            collection = self.db.favorites
            # TODO change user_id to ObjectId
            favorites = await collection.find({"user_id": user_id}).to_list(length=100)
            return favorites
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def delete_favorite(self, favorite_id: str):
        logger.info(f"🟡 [Repository] Deleting favorite {favorite_id} from MongoDB")
        try:
            collection = self.db.favorites
            result = await collection.delete_one({"_id": ObjectId(favorite_id)})
            if result.deleted_count == 1:
                logger.debug(f"🟢 [Repository] Favorite {favorite_id} deleted")
                return True
            else:
                logger.warning(f"🔴 [Repository] Favorite {favorite_id} not found")
                return False
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return False
        
    async def get_clothing_by_id(self, clothing_id: str):
        # Check in wardrobe collection if clothing_id exists
        clothing = await self.wardrobe_repo.get_cloth_by_id(clothing_id)
        return clothing