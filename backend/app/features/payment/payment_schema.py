from pydantic import BaseModel, Field
from typing import Literal

# -----------------------------
# Request: Création de session Stripe
# -----------------------------

class CreateCheckoutSessionRequest(BaseModel):
    pack: Literal["free", "decouverte", "standard", "creatif", "illimite"] = Field(..., description="Nom du pack à acheter")

# -----------------------------
# Response: URL Stripe Checkout
# -----------------------------

class CreateCheckoutSessionResponse(BaseModel):
    checkout_url: str = Field(..., description="URL Stripe Checkout pour effectuer le paiement")

# -----------------------------
# Webhook: Réponse après traitement Stripe
# -----------------------------

class StripeWebhookResponse(BaseModel):
    message: str = Field(..., description="Message indiquant le résultat du traitement du webhook")
