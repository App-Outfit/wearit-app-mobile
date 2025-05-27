from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import Dict

from app.core.errors import InternalServerError, NotFoundError


class PaymentRepository:
    def __init__(self, db: Database):
        self.db = db
        self._payments = db["payments"]
        self._users = db["users"]

    # ----------------------------
    # Ajouter des crédits à un utilisateur
    # ----------------------------

    async def add_credits_to_user(self, user_id: str, amount: int) -> None:
        result = await self._users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"credits": amount}, "$set": {"updated_at": datetime.now()}}
        )
        if result.matched_count == 0:
            raise NotFoundError("User not found")

    # ----------------------------
    # Enregistrer un paiement
    # ----------------------------

    async def save_payment(self, data: Dict) -> None:
        full_data = {
            **data,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        result = await self._payments.insert_one(full_data)
        if not result.inserted_id:
            raise InternalServerError("Failed to record payment")
