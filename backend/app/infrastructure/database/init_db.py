import sys
import os

# Ajoute le dossier parent au chemin Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from app.infrastructure.database.postgres import PostgresDB
from app.infrastructure.database.models.base import Base
import asyncio

async def init_db():
    """Créer toutes les tables dans PostgreSQL"""
    async with PostgresDB().engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(init_db())
print("✅ Tables PostgreSQL créées avec succès !")