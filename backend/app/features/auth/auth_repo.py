from pymongo.errors import PyMongoError
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import Optional, Dict
import random
import string

from app.core.errors import InternalServerError, NotFoundError
from app.core.logging_config import logger
from app.models.user_model import UserInDB, PyObjectId



class AuthRepository:
    def __init__(self, db: Database):
        self.db = db
        self._col = db["users"]

    # ----------------------------
    # Création & Lecture
    # ----------------------------

    async def create_user(self, user_data: Dict) -> UserInDB:
        try:
            result = await self._col.insert_one(user_data)
            user_data["_id"] = result.inserted_id
            return UserInDB(**user_data)
        except PyMongoError:
            logger.exception("MongoDB insert error")
            raise InternalServerError("Unable to create user")

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        try:
            doc = await self._col.find_one({"email": email})
            return UserInDB(**doc) if doc else None
        except PyMongoError:
            logger.exception("MongoDB find error")
            raise InternalServerError("Database failure")

    async def get_user_by_referral_code(self, code: str) -> Optional[UserInDB]:
        try:
            doc = await self._col.find_one({"referral_code": code})
            return UserInDB(**doc) if doc else None
        except PyMongoError:
            logger.exception("MongoDB find referral_code error")
            raise InternalServerError("Database failure")

    # ----------------------------
    # Referral Code
    # ----------------------------

    async def generate_unique_referral_code(self, length: int = 6) -> str:
        for _ in range(10):  # max 10 tentatives
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            exists = await self._col.find_one({"referral_code": code})
            if not exists:
                return code
        raise InternalServerError("Could not generate unique referral code")

    # ----------------------------
    # Crédit (Parrainage)
    # ----------------------------

    async def increment_credits(self, user_id: PyObjectId, amount: int) -> None:
        try:
            result = await self._col.update_one(
                {"_id": user_id},
                {"$inc": {"credits": amount}, "$set": {"updated_at": datetime.utcnow()}}
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError:
            logger.exception("MongoDB error on credit increment")
            raise InternalServerError("Failed to increment credits")

    # ----------------------------
    # Suppression
    # ----------------------------

    async def delete_user_by_id(self, user_id: str) -> None:
        try:
            result = await self._col.delete_one({"_id": ObjectId(user_id)})
            if result.deleted_count != 1:
                raise InternalServerError("No user deleted")
        except PyMongoError:
            logger.exception("MongoDB delete error")
            raise InternalServerError("Unable to delete user")

    # ----------------------------
    # Password Reset
    # ----------------------------

    async def set_password_reset_code(self, email: str, code: str, expiry: datetime) -> None:
        try:
            result = await self._col.update_one(
                {"email": email},
                {"$set": {"reset_code": code, "reset_code_expiry": expiry}}
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError:
            logger.exception("MongoDB error setting reset code")
            raise InternalServerError("Failed to set reset code")

    async def get_password_reset_record(self, email: str) -> Optional[Dict]:
        try:
            doc = await self._col.find_one(
                {"email": email},
                {"reset_code": 1, "reset_code_expiry": 1}
            )
            return doc if doc and "reset_code" in doc else None
        except PyMongoError:
            logger.exception("MongoDB error fetching reset code")
            raise InternalServerError("Failed to verify reset code")

    async def update_password(self, email: str, hashed_password: str) -> None:
        try:
            result = await self._col.update_one(
                {"email": email},
                {
                    "$set": {
                        "password": hashed_password,
                        "updated_at": datetime.utcnow()
                    },
                    "$unset": {"reset_code": "", "reset_code_expiry": ""}
                }
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError:
            logger.exception("MongoDB error updating password")
            raise InternalServerError("Failed to update password")
