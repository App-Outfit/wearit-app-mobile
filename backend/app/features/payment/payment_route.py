from fastapi import APIRouter, Depends, HTTPException
from app.core.logging_config import logger
from app.infrastructure.database.dependencies import get_current_user, get_db
from app.features.payment.payment_schema import (
    CreatePaymentSessionRequest,
    CreatePaymentSessionResponse,
    PaymentHistoryResponse,
)
from app.features.payment.payment_service import PaymentService
from app.features.payment.payment_repo import PaymentRepository

router = APIRouter(prefix="/payment", tags=["Payment"])

def get_payment_service(db=Depends(get_db)):
    return PaymentService(repo=PaymentRepository(db))

# -----------------------
# ✅ Créer une session Stripe
# -----------------------

@router.post("/create-session", response_model=CreatePaymentSessionResponse)
async def create_payment_session(
    payload: CreatePaymentSessionRequest,
    current_user=Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service)
):
    logger.info(f"💳 [API] POST /payment/create-session — user_id={current_user.id}")
    try:
        return await service.create_stripe_session(current_user, payload)
    except Exception as e:
        logger.exception("❌ Stripe session creation failed")
        raise HTTPException(status_code=500, detail="Could not create payment session")

# -----------------------
# 📜 Récupérer l’historique des paiements
# -----------------------

@router.get("/history", response_model=PaymentHistoryResponse)
async def get_payment_history(
    current_user=Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service)
):
    logger.info(f"📄 [API] GET /payment/history — user_id={current_user.id}")
    return await service.get_user_payment_history(current_user.id)

# -----------------------
# ✅ Webhook Stripe (à sécuriser côté Stripe avec une signature)
# -----------------------

@router.post("/webhook")
async def handle_stripe_webhook(
    request,
    service: PaymentService = Depends(get_payment_service)
):
    # ⚠️ Ce endpoint ne nécessite pas d'authentification utilisateur, Stripe l'appelle directement.
    logger.info("📩 [Webhook] Stripe webhook received")
    return await service.handle_stripe_webhook(await request.body(), request.headers)
