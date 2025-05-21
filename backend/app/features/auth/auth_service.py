# app/services/auth_service.py
from datetime import datetime, timedelta
from typing import Any
from passlib.context import CryptContext
from jose import jwt
import random

from app.core.errors import (
    ConflictError, NotFoundError, InternalServerError,
    UnauthorizedError, ValidationError
)
from app.core.logging_config import logger
from app.core.config import settings
from app.features.auth.email_service import EmailService
from app.features.auth.auth_repo import AuthRepository
from app.features.auth.password_reset_repo import PasswordResetRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.features.auth.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse, ResetPasswordRequest,
    ForgotPasswordRequest, ForgotPasswordResponse,
    VerifyResetCodeRequest, VerifyResetCodeResponse,
    ResetPasswordResponse, AuthDeleteResponse
)

class AuthService:
    def __init__(
        self,
        repo: AuthRepository,
        storage: StorageRepository,
        pwd_ctx: CryptContext = CryptContext(schemes=["bcrypt"], deprecated="auto"),
        email_service: EmailService = None,
        reset_repo: PasswordResetRepository = None
    ):
        self.repo = repo
        self.storage = storage
        self.pwd = pwd_ctx
        self.email_service = email_service or EmailService()
        if reset_repo is not None:
            self.reset_repo = reset_repo
        elif repo is not None:
            self.reset_repo = PasswordResetRepository(db=repo.db)
        else:
            self.reset_repo = None

    def hash_password(self, password: str) -> str:
        return self.pwd.hash(password)

    def verify_password(self, plain: str, hashed: str) -> bool:
        return self.pwd.verify(plain, hashed)

    def create_access_token(self, subject: str) -> str:
        data = {"sub": subject}
        expire = datetime.now() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        data["exp"] = expire
        return jwt.encode(data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    async def signup(self, user: AuthSignup) -> AuthSignupResponse:
        email = user.email.lower()
        logger.info("Signup attempt for %s", email)

        # 1) Vérifier unicité
        if await self.repo.get_user_by_email(email):
            logger.warning("Email already in use: %s", email)
            raise ConflictError("Email already registered")

        # 2) Hash du mot de passe
        hashed = self.hash_password(user.password)

        # 3) Création de l'utilisateur avec gestion complète des erreurs
        try:
            new_user = await self.repo.create_user(email, hashed, user.name, user.answers)
        except Exception as e:
            logger.error("🔴 [Service] Failed to create user: %s", e)
            raise InternalServerError("Failed to create user")

        if new_user is None:
            logger.error("🔴 [Service] Repository returned None on create_user")
            raise InternalServerError("Failed to create user")

        # 4) Génération du token
        token = self.create_access_token({"sub": new_user.email})
        logger.info("Signup successful for %s", email)
        return AuthSignupResponse(token=token, message="Signed up successfully")

    async def login(self, user: AuthLogin) -> AuthLoginResponse:
        email = user.email.lower()
        logger.info("Login attempt for %s", email)

        existing = await self.repo.get_user_by_email(email)
        if not existing:
            logger.warning("User not found: %s", email)
            raise NotFoundError("User not found")

        if not self.verify_password(user.password, existing.password):
            logger.warning("Wrong password for %s", email)
            raise UnauthorizedError("Incorrect credentials")

        token = self.create_access_token(existing.email)
        logger.info("Login successful for %s", email)
        return AuthLoginResponse(token=token, message="Logged in successfully")

    async def delete_account(self, user: Any) -> AuthDeleteResponse:
        # 1) delete images
        try:
            await self.storage.delete_account_images(user.id)
        except Exception:
            logger.exception("Failed to delete S3 images")
            raise InternalServerError("Could not delete user images")

        # 2) delete user doc
        await self.repo.delete_user_by_id(user.id)
        logger.info("Account deleted for %s", user.id)
        return AuthDeleteResponse(message="Account deleted successfully")

    async def forgot_password(self, request: ForgotPasswordRequest) -> ForgotPasswordResponse:
        email = request.email.lower()
        user = await self.repo.get_user_by_email(email)
        # pour ne pas révéler l’existence de l’email, on répond toujours OK
        if user:
            # génère un code aléatoire à 4 chiffres
            code = f"{random.randint(0,9999):04d}"
            await self.reset_repo.upsert_code(email, code, settings.PASSWORD_RESET_EXPIRE_MINUTES)
            await self.email_service.send_reset_code(to_email=email, code=code)
        return ForgotPasswordResponse(message="If the email exists, a reset code has been sent")

    async def verify_reset_code(self, request: VerifyResetCodeRequest) -> VerifyResetCodeResponse:
        email = request.email.lower()
        doc = await self.reset_repo.get_code_doc(email)
        if not doc or doc.get("code") != request.code or doc.get("expires_at") < datetime.now():
            return VerifyResetCodeResponse(valid=False)
        return VerifyResetCodeResponse(valid=True)

    async def reset_password(self, request: ResetPasswordRequest) -> ResetPasswordResponse:
        email = request.email.lower()
        # 1) vérifier le code
        valid = await self.verify_reset_code(VerifyResetCodeRequest(**request.model_dump()))
        if not valid.valid:
            raise ValidationError("Invalid or expired reset code")
        # 2) hash + update
        new_hashed = self.hash_password(request.new_password)
        await self.repo.update_password(email, new_hashed)
        # 3) cleanup
        await self.reset_repo.delete_code(email)
        return ResetPasswordResponse(message="Password reset successfully")