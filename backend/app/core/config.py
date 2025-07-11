from dotenv import load_dotenv
import os
load_dotenv()

from pydantic import ConfigDict

class Settings:
    """Classe de configuration pour l'application FastAPI"""
    PROJECT_NAME: str = "WearIT API"
    PROJECT_VERSION: str = "0.1.0"
    PROJECT_DESCRIPTION: str = ""
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list = ["*"]  # Liste des origines autorisées pour CORS

    JWT_EXPIRE_MINUTES: int = 60  # Durée d'expiration du token JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "")

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "")

    MONGODB_URI: str = os.getenv("MONGODB_URI_PROD", "")
    MONGODB_DB: str = os.getenv("MONGODB_DATABASE_LOCAL", "")
    MONGODB_PRODUCTS_DB: str = os.getenv("MONGODB_PRODUCTS_DB", "")

    AWS_REGION_NAME: str = os.getenv("AWS_REGION_NAME", "")
    AWS_BUCKET_NAME: str = os.getenv("AWS_BUCKET_NAME", "")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")

    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "")
    SMTP_STARTTLS: bool = os.getenv("SMTP_STARTTLS", "true").lower() == "true"
    SMTP_SSL: bool = os.getenv("SMTP_SSL", "false").lower() == "true"
    PASSWORD_RESET_EXPIRE_MINUTES: int = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", 10))

    STRIPE_PUBLIC_KEY: str = os.getenv("STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    PYTHON_API_BASE_URL: str = os.getenv("PYTHON_API_BASE_URL", "")

    REPLICATE_API_TOKEN: str = os.getenv("REPLICATE_API_TOKEN", "")
    REPLICATE_MODEL_REF: str = os.getenv("REPLICATE_MODEL_REF", "")
    REPLICATE_BODY_REF: str = os.getenv("REPLICATE_BODY_REF", "")

settings = Settings()
