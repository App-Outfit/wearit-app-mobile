from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.logging_config import logger
import os
from sqlalchemy.sql import text
from typing import AsyncGenerator
from dotenv import load_dotenv
load_dotenv()

class PostgresDB:
    """Classe pour gérer la connexion à PostgreSQL"""

    _instance = None  # Singleton

    def __new__(cls):
        """Singleton pour éviter plusieurs instances"""
        if cls._instance is None:
            cls._instance = super(PostgresDB, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialisation de la connexion PostgreSQL"""
        self.POSTGRES_URL = os.getenv(
            "POSTGRES_DB_URL", 
            "postgresql+asyncpg://wearit_user:wearit_password@localhost/wearit"
        )

        # 📌 Création de l'engine async PostgreSQL
        self.engine = create_async_engine(self.POSTGRES_URL, echo=False, future=True)

        # 📌 Création du session factory
        self.AsyncSessionLocal = sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False
        )

    def get_session(self):
        """Retourne une fonction de dépendance pour FastAPI"""
        async def session_generator():
            async with self.AsyncSessionLocal() as session:
                yield session
        return session_generator

    async def connect(self):
        """Teste la connexion à PostgreSQL"""
        try:
            async with self.engine.connect() as conn:  # 🔥 Correction ici
                logger.info("🟡 [PostgreSQL] Connecting to database...")
                result = await conn.execute(text("SELECT 1"))  # 🔥 Appel correct
                logger.info(f"🟢 [PostgreSQL] Connected successfully!")
        except Exception as e:
            logger.error(f"🔴 [PostgreSQL] Connection failed: {e}")

    async def close(self):
        """Ferme la connexion PostgreSQL proprement"""
        await self.engine.dispose()
        logger.info("🔴 [PostgreSQL] Connection closed.")

postgres_db = PostgresDB()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with PostgresDB().AsyncSessionLocal() as session:
        yield session