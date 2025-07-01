import stripe
from app.core.config import settings
from bson import ObjectId
from .payment_repo import PaymentRepository
from .payment_schema import CreateCheckoutSessionRequest, CreateCheckoutSessionResponse
from app.core.errors import ValidationError, InternalServerError
from .payment_schema import StripeWebhookResponse

# Initialiser Stripe avec la clé secrète
stripe.api_key = settings.STRIPE_SECRET_KEY

# Mapping pack → price_id Stripe
PRICE_IDS = {
    "free": "price_1RGK6mPHwI3zlbWau7FHZUpe",
    "decouverte": "price_1RTPskPHwI3zlbWaNcm4RK2w",
    "standard": "price_1RTPtJPHwI3zlbWaZn6r1TNN",
    "creatif": "price_1RTPtdPHwI3zlbWaQez7MrAg",
    "illimite": "price_1RTPttPHwI3zlbWa5hvqtvXR"
}

CREDITS_BY_PACK = {
    "free": 5,
    "decouverte": 50,
    "standard": 100,
    "creatif": 300,
    "illimite": 800
}

class PaymentService:
    def __init__(self, repo: PaymentRepository):
        self.repo = repo

    async def create_checkout_session(
        self,
        payload: CreateCheckoutSessionRequest,
        current_user
    ) -> CreateCheckoutSessionResponse:
        pack = payload.pack

        if pack not in PRICE_IDS:
            raise ValidationError("Invalid pack selected")

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price": PRICE_IDS[pack],
                    "quantity": 1,
                }],
                mode="payment",
                success_url=f"{settings.PYTHON_API_BASE_URL}{settings.API_V1_STR}/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.PYTHON_API_BASE_URL}{settings.API_V1_STR}/cancel",
                metadata={
                    "user_id": str(current_user.id),
                    "pack": pack
                }
            )
            return CreateCheckoutSessionResponse(checkout_url=session.url)
        except Exception as e:
            raise InternalServerError(f"Stripe error: {str(e)}")
        
    async def handle_stripe_webhook(self, payload: bytes, sig_header: str) -> StripeWebhookResponse:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            raise ValidationError("Invalid Stripe signature.")

        if event["type"] != "checkout.session.completed":
            return StripeWebhookResponse(message="Event ignored.")

        session = event["data"]["object"]
        user_id = session["metadata"]["user_id"]
        pack = session["metadata"]["pack"]
        session_id = session["id"]
        amount = session["amount_total"]

        credits = CREDITS_BY_PACK.get(pack)
        if not credits:
            raise ValidationError("Invalid pack.")

        await self.repo.add_credits_to_user(user_id=user_id, amount=credits)
        await self.repo.save_payment({
            "user_id": ObjectId(user_id),
            "stripe_session_id": session_id,
            "type": "credits",
            "amount": amount,
            "credits_added": credits,
            "subscription_type": None,
            "status": "paid"
        })

        return StripeWebhookResponse(message=f"{credits} crédits ajoutés avec succès.")
