from motor.motor_asyncio import AsyncIOMotorClient
from app.core.logging_config import logger

class MongoDB:
    _client = None
    _database = None

    @classmethod
    async def connect(cls, db_url: str, db_name: str):
        """ Initialise la connexion à MongoDB une seule fois """
        if cls._client is None:
            logger.info("🟡 [MongoDB] Connecting to database...")
            cls._client = AsyncIOMotorClient(db_url)
            cls._database = cls._client[db_name]
            logger.info("🟢 [MongoDB] Connected to database")

    @classmethod
    def get_database(cls):
        """ Retourne la connexion existante """
        if cls._database is None:
            logger.error("🔴 [MongoDB] MongoDB is not connected. Call connect() first.")
            raise Exception("MongoDB is not connected. Call connect() first.")
        return cls._database

    @classmethod
    async def close(cls):
        """ Ferme la connexion MongoDB proprement """
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._database = None
            logger.info("🔴 [MongoDB] Connection closed.")

class MongoDBProducts:
    _client = None
    _database = None

    @classmethod
    async def connect(cls, db_url: str, db_name: str):
        if cls._client is None:
            logger.info("🟡 [MongoDBProducts] Connecting to products database...")
            cls._client = AsyncIOMotorClient(db_url)
            cls._database = cls._client[db_name]
            logger.info("🟢 [MongoDBProducts] Connected to products database")

    @classmethod
    def get_database(cls):
        if cls._database is None:
            logger.error("🔴 [MongoDBProducts] MongoDBProducts is not connected. Call connect() first.")
            raise Exception("MongoDBProducts is not connected. Call connect() first.")
        return cls._database

    @classmethod
    async def close(cls):
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._database = None
            logger.info("🔴 [MongoDBProducts] Connection closed.")
