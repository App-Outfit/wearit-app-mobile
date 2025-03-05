from app.infrastructure.database.mongodb import MongoDB
from app.core.logging_config import logger
from bson import ObjectId

class WardrobeRepository:
    def __init__(self):
        self.db = MongoDB.get_database()

    async def create_cloth(self, cloth: dict):
        logger.info(f"🟡 [Repository] Inserting new cloth into MongoDB")
        try:
            collection = self.db.wardrobe
            result = await collection.insert_one(cloth)
            return result.inserted_id
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None

    async def get_cloth_by_id(self, cloth_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for cloth_id: {cloth_id}")
        try:
            collection = self.db.wardrobe
            cloth = await collection.find_one({"_id": ObjectId(cloth_id)})

            if cloth:
                logger.debug(f"🟢 [Repository] Cloth {cloth_id} found")
                return cloth
            else:
                logger.warning(f"🔴 [Repository] Cloth {cloth_id} not found")
                return None
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None