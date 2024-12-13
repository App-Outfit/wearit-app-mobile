import os
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth

load_dotenv()

def get_mongo_database(async_mode: bool = False):
    """Get the MongoDB database connection.

    This function returns a MongoDB database connection based on the environment
    configuration (`local` or `prod`). It supports both synchronous and asynchronous
    clients.

    Args:
        async_mode (bool, optional): Whether to use an asynchronous client (`motor`). 
            Defaults to `False` for synchronous mode.

    Raises:
        ValueError: If the `ENVIRONMENT` variable is not recognized as `local` or `prod`.

    Returns:
        Database: A `pymongo.database.Database` object if `async_mode` is `False`.
        AsyncIOMotorDatabase: A `motor.motor_asyncio.AsyncIOMotorDatabase` object if `async_mode` is `True`.
    """
    environment = os.getenv("ENVIRONMENT", "local")
    
    if environment == "local":
        mongo_uri = os.getenv("MONGODB_URI_LOCAL", "mongodb://localhost:27017/")
        db_name = os.getenv("MONGODB_DATABASE_LOCAL", "wearit-test")
    elif environment == "prod":
        mongo_uri = os.getenv("MONGODB_URI_PROD")
        db_name = os.getenv("MONGODB_DATABASE_PROD")
    else:
        raise ValueError("Environment must be either 'local' or 'prod'")
    
    # Choose between synchronous and asynchronous client
    if async_mode:
        client = AsyncIOMotorClient(mongo_uri)
    else:
        client = MongoClient(mongo_uri)
    
    db = client[db_name]

    # Log connection details
    print(f"Connected to MongoDB: {mongo_uri}")
    print(f"Using database: {db_name} for environment: {environment}")
    
    return db

# OAuth configuration
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://accounts.google.com/o/oauth2/token",
    redirect_uri=os.getenv("GOOGLE_REDIRECT_URI"),
    client_kwargs={"scope": "openid email profile"},
)