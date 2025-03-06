from app.infrastructure.database.mongodb import MongoDB
from app.core.logging_config import logger
from app.core.errors import NotFoundError
from bson import ObjectId

class AuthRepository:
    def __init__(self, db=None):
        self.db = db if db is not None else MongoDB().get_database()

    async def create_user(self, user: dict):
        logger.info(f"🟡 [Repository] Inserting new user into MongoDB")
        try:
            collection = self.db.users
            result = await collection.insert_one(user)
            return result.inserted_id
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None
        
    async def get_user_by_email(self, email: str):
        logger.info(f"🟡 [Repository] Getting user by email from MongoDB")
        try:
            collection = self.db.users
            result = await collection.find_one({"email": email})
            return result
        except Exception as e:
            logger.error(f"🔴 [Repository] An error occurred: {e}")
            return None