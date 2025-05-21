from pymongo.errors import PyMongoError
from pymongo.database import Database
from bson import ObjectId
from typing import Optional
from datetime import datetime

from app.core.logging_config import logger
from app.core.errors import InternalServerError, NotFoundError

from app.models.user_model import UserInDB
from .user_schema import UserProfileUpdate


class UserRepository:
    def __init__(self, db: Database):
        self._col = db["users"]

    # -----------------------
    # Get user by ID
    # -----------------------

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        try:
            doc = await self._col.find_one({"_id": ObjectId(user_id)})
            if not doc:
                raise NotFoundError("User not found")
            return UserInDB.model_validate(doc)
        except PyMongoError:
            logger.exception("MongoDB find error")
            raise InternalServerError("Database failure")
        except Exception as e:
            logger.exception("Validation error on user document")
            raise InternalServerError("Failed to deserialize user")

    # -----------------------
    # Update user profile
    # -----------------------

    async def update_profile(self, user_id: str, payload: UserProfileUpdate) -> UserInDB:
        update_data = {
            k: v for k, v in payload.model_dump().items() if v is not None
        }

        update_data["updated_at"] = datetime.utcnow()

        try:
            result = await self._col.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            if result.matched_count == 0:
                raise NotFoundError("User not found")
        except PyMongoError:
            logger.exception("MongoDB update error")
            raise InternalServerError("Failed to update profile")

        return await self.get_user_by_id(user_id)