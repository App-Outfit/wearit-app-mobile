import logging

logger = logging.getLogger(__name__)

def send_reset_email(email: str, reset_token: str):
    """Simule l'envoi d'un e-mail de réinitialisation de mot de passe.

    Args:
        email (str): L'email de l'utilisateur.
        reset_token (str): Le token de réinitialisation.
    """
    reset_link = f"http://localhost:8000/api/auth/reset-password?token={reset_token}"
    logger.info(f"Send email to {email}: Click here to reset your password: {reset_link}")
    print(f"Password reset link: {reset_link}")