from fastapi import APIRouter, Depends, Request
from app.core.logging_config import logger
from app.infrastructure.database.dependencies import get_current_user, get_db
from .payment_service import PaymentService
from .payment_repo import PaymentRepository
from .payment_schema import (
    CreateCheckoutSessionRequest,
    CreateCheckoutSessionResponse,
    StripeWebhookResponse
)
import string

router = APIRouter(prefix="/payment", tags=["Payment"])

def get_payment_service(db=Depends(get_db)):
    return PaymentService(PaymentRepository(db))

# ✅ POST create Stripe checkout session
@router.post("/create-checkout-session", response_model=CreateCheckoutSessionResponse)
async def create_checkout_session(
    payload: CreateCheckoutSessionRequest,
    current_user=Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service)
):
    logger.info(f"💳 [API] Received payment request for pack '{payload.pack}' from user {current_user.id}")
    return await service.create_checkout_session(payload, current_user)

# ✅ Stripe Webhook
@router.post("/webhook/stripe", response_model=StripeWebhookResponse)
async def stripe_webhook(
    request: Request,
    db=Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    service = PaymentService(PaymentRepository(db))
    return await service.handle_stripe_webhook(payload, sig_header)
