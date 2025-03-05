import pytest
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.infrastructure.database.mongodb import MongoDB

TEST_DB_URL = "mongodb://localhost:27017"
TEST_DB_NAME = "test_wearit"

@pytest.fixture(scope="function")
async def mongo_client():
    """Crée une connexion MongoDB unique pour tous les tests et la garde ouverte."""
    client = AsyncIOMotorClient(TEST_DB_URL)
    yield client  # MongoDB reste ouvert pendant toute la session
    client.close()  # Ne ferme qu'à la fin de tous les tests

@pytest.fixture(scope="function", autouse=True)
async def test_db(mongo_client):
    """Base MongoDB propre pour chaque test"""
    db = mongo_client[TEST_DB_NAME]
    
    # 🔥 S'assurer que MongoDB est bien connecté
    await MongoDB.connect(TEST_DB_URL, TEST_DB_NAME)

    yield db  # Passe la base de test aux tests

    # 🔥 Nettoyage après chaque test, mais NE FERME PAS MongoDB
    await db.client.drop_database(TEST_DB_NAME)
