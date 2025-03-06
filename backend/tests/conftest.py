import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from app.infrastructure.database.mongodb import MongoDB
from app.infrastructure.storage.s3_client import S3Client
import boto3
from moto import mock_aws
import os
from dotenv import load_dotenv
load_dotenv()

TEST_DB_URL = os.getenv("MONGODB_URI_LOCAL")
TEST_DB_NAME = "test_wearit"

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION_NAME")
AWS_BUCKET_NAME = "test_wearit"


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

@pytest.fixture(scope="function", autouse=True)
async def s3_mock():
    """Mock AWS S3 et initialise S3Client pour éviter l'erreur de connexion."""
    with mock_aws():
        s3_client = boto3.client(
            "s3",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        # Créer un bucket mocké pour les tests
        s3_client.create_bucket(
            Bucket=AWS_BUCKET_NAME,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION},
        )

        # 🔥 Initialiser S3Client avec les credentials mockés
        await S3Client.connect(
            region=AWS_REGION,
            bucket_name=AWS_BUCKET_NAME,
            access_key=AWS_ACCESS_KEY_ID,
            secret_key=AWS_SECRET_ACCESS_KEY,
        )

        yield s3_client  # Passe l'instance mockée aux tests

        # Nettoyage après le test
        await S3Client.close()
