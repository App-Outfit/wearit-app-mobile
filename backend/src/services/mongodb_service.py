import logging
from datetime import datetime
from config.settings import get_mongo_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBService:
    def __init__(self):
        self.db = get_mongo_database(async_mode=True)

    @property
    def users(self):
        return self.db.users
    
    async def create_user(self, username: str, email: str, password: str):
        user = {
            "username": username,
            "email": email,
            "password": password,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        result = await self.users.insert_one(user)
        logger.info(f"User {username} created with id {result.inserted_id}")
        
        return result
    
    async def find_user_by_email(self, email: str):
        user = await self.users.find_one({"email": email})
        return user
    
mongodb_service = MongoDBService()