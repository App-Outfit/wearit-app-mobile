import os
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

def get_mongo_database(async_mode=False):
    environment = os.getenv("ENVIRONMENT", "local")
    
    if environment == "local":
        mongo_uri = os.getenv("MONGODB_URI_LOCAL", "mongodb://localhost:27017/")
        db_name = os.getenv("MONGODB_DATABASE_LOCAL", "wearit-test")
    elif environment == "prod":
        mongo_uri = os.getenv("MONGODB_URI_PROD")
        db_name = os.getenv("MONGODB_DATABASE_PROD")
    else:
        raise ValueError("Environnement non reconnu. Utilisez 'local' ou 'prod' dans ENVIRONMENT.")
    
    # Choix entre client synchrone ou asynchrone
    if async_mode:
        client = AsyncIOMotorClient(mongo_uri)
    else:
        client = MongoClient(mongo_uri)
    
    db = client[db_name]

    # Log de confirmation
    print(f"Connecté à MongoDB : {mongo_uri}")
    print(f"Base de données utilisée : {db_name} pour l'environnement {environment}")
    
    return db