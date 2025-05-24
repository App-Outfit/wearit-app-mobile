import stripe

from app.core.config import settings
from app.core.logging_config import logger
from app.core.errors import InternalServerError, ValidationError

from .payment_repo import PaymentRepository
from .payment_schema import CreatePaymentSessionRequest, CreatePaymentSessionResponse, PaymentHistoryResponse, PaymentItem

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentService:
    def __init__(self, repo: PaymentRepository):
        self.repo = repo

    # ✅ Créer une session Stripe pour un paiement unique
    async def create_stripe_session(self, user, payload: CreatePaymentSessionRequest) -> CreatePaymentSessionResponse:
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[{
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": f"{payload.credits} credits WearIT"
                        },
                        "unit_amount": payload.amount_eur * 100,  # en centimes
                    },
                    "quantity": 1,
                }],
                metadata={
                    "user_id": str(user.id),
                    "credits": str(payload.credits),
                },
                success_url=f"{settings.FRONTEND_URL}/payment/success",
                cancel_url=f"{settings.FRONTEND_URL}/payment/cancel",
            )

            logger.info(f"💳 Stripe session created for user {user.id}")
            return CreatePaymentSessionResponse(session_url=session.url)

        except Exception as e:
            logger.exception("Stripe session creation failed")
            raise InternalServerError("Stripe session creation failed")

    # ✅ Webhook Stripe — Appelé automatiquement après un paiement réussi
    async def handle_stripe_webhook(self, payload: bytes, headers: dict):
        sig_header = headers.get("stripe-signature")

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.STRIPE_WEBHOOK_SECRET
            )

        except stripe.error.SignatureVerificationError:
            logger.warning("Invalid Stripe signature")
            raise ValidationError("Invalid Stripe webhook signature")

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            user_id = session["metadata"]["user_id"]
            credits = int(session["metadata"]["credits"])
            amount_eur = session["amount_total"] / 100

            # ✅ Ajouter les crédits à l'utilisateur
            await self.repo.increment_user_credits(user_id, credits)

            # 🧾 Enregistrer la transaction
            await self.repo.save_payment(
                user_id=user_id,
                amount_eur=amount_eur,
                credits=credits,
                stripe_session_id=session["id"]
            )

            logger.info(f"✅ Payment success — {credits} credits added to user {user_id}")

        return {"status": "ok"}

    # 📜 Récupérer l’historique de paiement d’un utilisateur
    async def get_user_payment_history(self, user_id: str) -> PaymentHistoryResponse:
        records = await self.repo.get_payments_by_user(user_id)
        items = [
            PaymentItem(
                amount_eur=record.amount_eur,
                credits=record.credits,
                created_at=record.created_at
            )
            for record in records
        ]
        return PaymentHistoryResponse(payments=items)
