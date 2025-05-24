from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

# -------------------------
# Requête pour créer un paiement
# -------------------------

class CreatePaymentSessionRequest(BaseModel):
    type: Literal["credits", "subscription"]
    credits: Optional[int] = None
    subscription_type: Optional[Literal["weekly", "monthly"]] = None

# -------------------------
# Réponse après création de la session Stripe
# -------------------------

class CreatePaymentSessionResponse(BaseModel):
    stripe_session_url: str

# -------------------------
# Historique d’un paiement
# -------------------------

class PaymentHistoryItem(BaseModel):
    id: str
    type: str
    amount: int
    status: str
    credits_added: Optional[int]
    subscription_type: Optional[str]
    created_at: datetime

class PaymentHistoryResponse(BaseModel):
    payments: list[PaymentHistoryItem]
