# app/services/email_service.py
import asyncio
from email.message import EmailMessage
from jinja2 import Environment, PackageLoader, select_autoescape
import smtplib

from app.core.config import settings
from app.core.errors import InternalServerError
from app.core.logging_config import logger

# Template Jinja2 chargé une seule fois
env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"])
)

class EmailService:
    async def send_reset_code(self, to_email: str, code: str) -> None:
        """
        Envoie le mail de reset en HTML + texte brut en tâche de fond.
        """
        loop = asyncio.get_running_loop()
        # On délègue tout le SMTP dans un thread pour ne pas bloquer l'event loop
        try:
            await loop.run_in_executor(None, self._send_smtp, to_email, code)
            logger.info("🟢 [EmailService] Reset code sent to %s", to_email)
        except Exception:
            logger.exception("🔴 [EmailService] Failed to send reset email")
            raise InternalServerError("Failed to send reset email")

    def _send_smtp(self, to_email: str, code: str) -> None:
        # Génération du contenu
        tpl  = env.get_template("reset_password.html")
        html = tpl.render(code=code, expire_minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES)
        plain = (
            f"Your reset code is {code}.\n"
            f"It expires in {settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes.\n"
            "If you didn't request this, please ignore this email."
        )

        # Construction du message
        msg = EmailMessage()
        msg["Subject"] = "Réinitialisez votre mot de passe WearIT"
        msg["From"]    = settings.SMTP_FROM_EMAIL
        msg["To"]      = to_email
        msg.set_content(plain)
        msg.add_alternative(html, subtype="html")

        # Envoi avec context manager et EHLO/TLS/login conditionnels
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            smtp.ehlo()
            if settings.SMTP_STARTTLS:
                smtp.starttls()
                smtp.ehlo()

            # Si vous avez un user/pass configuré, on se logue
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

            smtp.send_message(msg)
