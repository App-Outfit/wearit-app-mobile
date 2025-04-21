from pymongo.errors import PyMongoError
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from app.core.logging_config import logger
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.core.errors import InternalServerError
from app.core.errors import NotFoundError

class UserInDB(BaseModel):
    id: str
    email: EmailStr
    password: str
    name: str
    answers: dict[str,str] | None = None
    created_at: datetime

class ResetRecord(BaseModel):
    code: str
    expiry: datetime

class AuthRepository:
    def __init__(self, db: Database):
        self.db = db
        self._col = db["users"]

    async def create_user(self, email: str, hashed_password: str, name: str, answers: dict[str, str]) -> UserInDB:
        """Insère un document user et renvoie son DTO."""
        doc = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "answers": answers,
            "created_at": datetime.now(),
        }
        try:
            result = await self._col.insert_one(doc)
            doc["_id"] = result.inserted_id
            return UserInDB(
                id=str(doc["_id"]),
                email=doc["email"],
                password=doc["password"],
                name=doc["name"],
                answers=doc.get("answers"),
                created_at=doc["created_at"],
            )
        except PyMongoError as e:
            logger.exception("MongoDB insert error")
            raise InternalServerError("Unable to create user")

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Renvoie le DTO user ou None si pas trouvé."""
        try:
            doc = await self._col.find_one({"email": email})
        except PyMongoError as e:
            logger.exception("MongoDB find error")
            raise InternalServerError("Database failure")
        if not doc:
            return None
        return UserInDB(
            id=str(doc["_id"]),
            email=doc["email"],
            password=doc["password"],
            name=doc.get("name", ""),
            answers=doc.get("answers", None),
            created_at=doc.get("created_at"),
        )

    async def delete_user_by_id(self, user_id: str) -> None:
        """Lève InternalServerError si échec, None en succès."""
        try:
            result = await self._col.delete_one({"_id": ObjectId(user_id)})
        except PyMongoError as e:
            logger.exception("MongoDB delete error")
            raise InternalServerError("Unable to delete user")
        if result.deleted_count != 1:
            raise InternalServerError("No user was deleted")
        
    async def set_password_reset_code(self, email: str, code: str, expiry: datetime) -> None:
        try:
            result = await self._col.update_one(
                {"email": email},
                {"$set": {"reset_code": code, "reset_code_expiry": expiry}}
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError as e:
            logger.exception("MongoDB error setting reset code")
            raise InternalServerError("Failed to set reset code")

    async def get_password_reset_record(self, email: str) -> Optional[ResetRecord]:
        try:
            doc = await self._col.find_one(
                {"email": email},
                {"reset_code": 1, "reset_code_expiry": 1}
            )
        except PyMongoError as e:
            logger.exception("MongoDB error fetching reset code")
            raise InternalServerError("Failed to verify reset code")
        if not doc or "reset_code" not in doc:
            return None
        return ResetRecord(
            code=doc["reset_code"],
            expiry=doc["reset_code_expiry"],
        )

    async def update_password(self, email: str, hashed_password: str) -> None:
        try:
            result = await self._col.update_one(
                {"email": email},
                {
                    "$set": {"password": hashed_password},
                    "$unset": {"reset_code": "", "reset_code_expiry": ""}
                }
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError as e:
            logger.exception("MongoDB error updating password")
            raise InternalServerError("Failed to update password")