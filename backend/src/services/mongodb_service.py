import logging
from datetime import datetime
from src.config.settings import get_mongo_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBService:
    """MongoDB service class for managing user-related database operations.

    It interacts with the MongoDB database in asynchronous mode.
    """

    def __init__(self):
        """Initialize the MongoDBService with a reference to the MongoDB database."""
        self.db = get_mongo_database(async_mode=True)

    @property
    def users(self):
        """Get the MongoDB users collection.

        Returns:
            Collection: The MongoDB collection for user documents.
        """
        return self.db.users

    async def create_user(self, username: str, email: str, password: str) -> dict:
        """Create a new user in the MongoDB database.

        Args:
            username (str): The name of the user.
            email (str): The email address of the user.
            password (str): The hashed password of the user.

        Returns:
            dict: The result of the insertion operation, including the inserted ID.

        Logs:
            Logs the creation of the user with the inserted document ID.
        """
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

    async def find_user_by_email(self, email: str) -> dict:
        """Find a user by their email address.

        Args:
            email (str): The email address of the user to search for.

        Returns:
            dict: The user document if found, otherwise `None`.
        """
        user = await self.users.find_one({"email": email})
        return user
    
    async def update_user_password(self, email: str, new_password: str) -> dict:
        """Update the password of a user in the MongoDB database.

        Args:
            email (str): The email address of the user.
            new_password (str): The new hashed password for the user.

        Returns:
            dict: The result of the update operation, including the number of documents modified.
        """
        result = await self.users.update_one({"email": email}, {"$set": {"password": new_password}})
        return result

mongodb_service = MongoDBService()