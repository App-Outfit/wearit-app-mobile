from app.infrastructure.database.mongodb import MongoDB
from app.core.logging_config import logger
from bson import ObjectId

class BodyRepository:
    def __init__(self, db=None):
        self.db = db if db is not None else MongoDB().get_database()
        
    async def create_body(self, body: dict):
        logger.info(f"🟡 [Repository] Inserting new body into MongoDB")
        try:
            collection = self.db.bodies
            result = await collection.insert_one(body)
            return result.inserted_id
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_body_by_id(self, body_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for body_id: {body_id}")
        try:
            collection = self.db.bodies
            body = await collection.find_one({"_id": ObjectId(body_id)})

            if body:
                logger.debug(f"🟢 [Repository] Body {body_id} found")
                return body
            else:
                logger.warning(f"🔴 [Repository] Body {body_id} not found")
                return None
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_bodies(self, user_id: str):
        logger.info(f"🟡 [Repository] Querying MongoDB for user_id: {user_id}")
        try:
            collection = self.db.bodies
            # TODO change user_id to ObjectId
            bodies = await collection.find({"user_id": user_id}).to_list(length=100)
            return bodies
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def delete_body(self, body_id: str):
        logger.info(f"🟡 [Repository] Deleting body {body_id} from MongoDB")
        try:
            collection = self.db.bodies
            result = await collection.delete_one({"_id": ObjectId(body_id)})
            if result.deleted_count == 1:
                logger.debug(f"🟢 [Repository] Body {body_id} deleted")
                return True
            else:
                logger.warning(f"🔴 [Repository] Body {body_id} not found")
                return False
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return False