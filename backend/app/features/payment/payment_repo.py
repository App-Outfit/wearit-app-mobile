from datetime import datetime
from typing import List
from bson import ObjectId
from pymongo.database import Database

from app.core.errors import InternalServerError
from .payment_model import PaymentModel


class PaymentRepository:
    def __init__(self, db: Database):
        self._col = db["payments"]
        self._user_col = db["users"]

    # ✅ Enregistrer un paiement réussi
    async def save_payment(self, user_id: str, amount_eur: float, credits: int, stripe_session_id: str) -> PaymentModel:
        doc = {
            "user_id": ObjectId(user_id),
            "amount_eur": amount_eur,
            "credits": credits,
            "stripe_session_id": stripe_session_id,
            "created_at": datetime.now()
        }
        result = await self._col.insert_one(doc)
        if not result.inserted_id:
            raise InternalServerError("Failed to save payment")
        doc["_id"] = result.inserted_id
        return PaymentModel(**doc)

    # ✅ Ajouter les crédits à l'utilisateur
    async def increment_user_credits(self, user_id: str, credits: int) -> None:
        result = await self._user_col.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"credits": credits}}
        )
        if result.modified_count == 0:
            raise InternalServerError("Failed to update user credits")

    # 📜 Liste des paiements par utilisateur
    async def get_payments_by_user(self, user_id: str) -> List[PaymentModel]:
        cursor = self._col.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
        docs = await cursor.to_list(length=None)
        return [PaymentModel(**doc) for doc in docs]
