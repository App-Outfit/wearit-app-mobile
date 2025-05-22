# app/repositories/password_reset_repo.py

from pymongo.errors import PyMongoError
from pymongo.database import Database
from datetime import datetime, timedelta
from app.core.logging_config import logger
from app.core.errors import InternalServerError

class PasswordResetRepository:
    """Gère les codes de réinitialisation dans `password_resets`."""
    def __init__(self, db: Database):
        self._col = db["password_resets"]
        # db.password_resets.createIndex({"expires_at": 1}, {"expireAfterSeconds": 0})

    async def upsert_code(self, email: str, code: str, expire_minutes: int):
        """Insère ou met à jour le code + expiration pour cet email."""
        expiry = datetime.now() + timedelta(minutes=expire_minutes)
        try:
            await self._col.update_one(
                {"email": email},
                {"$set": {"code": code, "expires_at": expiry}},
                upsert=True
            )
        except PyMongoError as e:
            logger.exception("🔴 [PwdResetRepo] Failed to upsert reset code")
            raise InternalServerError("Failed to store reset code")

    async def get_code_doc(self, email: str):
        """Récupère le document (email, code, expires_at) ou None."""
        try:
            return await self._col.find_one({"email": email})
        except PyMongoError as e:
            logger.exception("🔴 [PwdResetRepo] Failed to fetch reset code")
            raise InternalServerError("Failed to fetch reset code")

    async def delete_code(self, email: str):
        """Supprime tous les codes (cleanup après reset)."""
        try:
            await self._col.delete_many({"email": email})
        except PyMongoError as e:
            logger.exception("🔴 [PwdResetRepo] Failed to delete reset code")
            raise InternalServerError("Failed to delete reset code")
