from datetime import datetime, timedelta
from typing import Any
from passlib.context import CryptContext
from jose import jwt
import random
import string

from app.core.errors import (
    ConflictError, NotFoundError, InternalServerError,
    UnauthorizedError, ValidationError
)
from app.core.logging_config import logger
from app.core.config import settings
from app.features.auth.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    ForgotPasswordRequest, ForgotPasswordResponse,
    VerifyResetCodeRequest, VerifyResetCodeResponse,
    ResetPasswordRequest, ResetPasswordResponse,
    AuthDeleteResponse
)
from app.features.auth.email_service import EmailService
from app.features.auth.auth_repo import AuthRepository
from app.features.auth.password_reset_repo import PasswordResetRepository
from app.infrastructure.storage.storage_repo import StorageRepository


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
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        data["exp"] = expire
        return jwt.encode(data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    async def signup(self, user: AuthSignup) -> AuthSignupResponse:
        email = user.email.lower()
        logger.info(f"📥 Signup attempt for {email}")

        if await self.repo.get_user_by_email(email):
            raise ConflictError("Email already registered")

        hashed_pw = self.hash_password(user.password)

        # Génére le referral_code (unique à vérifier)
        referral_code = await self.repo.generate_unique_referral_code()

        # Initialise l'utilisateur
        user_data = {
            "email": email,
            "password": hashed_pw,
            "first_name": user.first_name,
            "gender": user.gender,
            "answers": user.answers or {},
            "credits": 5,
            "referral_code": referral_code,
            "ref_by": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Vérifie s’il y a un code de parrainage utilisé
        if user.referral_code:
            parrain = await self.repo.get_user_by_referral_code(user.referral_code)
            if parrain:
                new_credits = 15
                user_data["credits"] += new_credits
                user_data["ref_by"] = parrain.id
                await self.repo.increment_credits(parrain.id, new_credits)
                logger.info(f"🤝 Referral: {parrain.id} gets +{new_credits}, {email} gets +{new_credits}")
            else:
                logger.warning(f"❌ Invalid referral code used: {user.referral_code}")
                raise ValidationError("Invalid referral code")
        
        try:
            new_user = await self.repo.create_user(user_data)
        except Exception as e:
            logger.exception("🔴 Failed to create user")
            raise InternalServerError("User creation failed")

        token = self.create_access_token(new_user.email)
        return AuthSignupResponse(token=token, message="Signed up successfully")

    async def login(self, user: AuthLogin) -> AuthLoginResponse:
        email = user.email.lower()
        logger.info(f"🔐 Login attempt for {email}")

        existing = await self.repo.get_user_by_email(email)
        if not existing:
            raise NotFoundError("User not found")

        if not self.verify_password(user.password, existing.password):
            raise UnauthorizedError("Incorrect credentials")

        token = self.create_access_token(existing.email)
        return AuthLoginResponse(token=token, message="Logged in successfully")

    async def delete_account(self, user: Any) -> AuthDeleteResponse:
        try:
            await self.storage.delete_account_images(user.id)
        except Exception:
            logger.exception("S3 image deletion failed")
            raise InternalServerError("Failed to delete images")

        await self.repo.delete_user_by_id(user.id)
        logger.info(f"🗑️ User account deleted: {user.id}")
        return AuthDeleteResponse(message="Account deleted successfully")

    async def forgot_password(self, request: ForgotPasswordRequest) -> ForgotPasswordResponse:
        email = request.email.lower()
        user = await self.repo.get_user_by_email(email)
        if user:
            code = f"{random.randint(0, 9999):04d}"
            await self.reset_repo.upsert_code(email, code, settings.PASSWORD_RESET_EXPIRE_MINUTES)
            await self.email_service.send_reset_code(to_email=email, code=code)
        return ForgotPasswordResponse(message="If the email exists, a reset code has been sent")

    async def verify_reset_code(self, request: VerifyResetCodeRequest) -> VerifyResetCodeResponse:
        email = request.email.lower()
        doc = await self.reset_repo.get_code_doc(email)
        if not doc or doc.get("code") != request.code or doc.get("expires_at") < datetime.utcnow():
            return VerifyResetCodeResponse(valid=False)
        return VerifyResetCodeResponse(valid=True)

    async def reset_password(self, request: ResetPasswordRequest) -> ResetPasswordResponse:
        email = request.email.lower()
        valid = await self.verify_reset_code(VerifyResetCodeRequest(**request.model_dump()))
        if not valid.valid:
            raise ValidationError("Invalid or expired reset code")

        hashed = self.hash_password(request.new_password)
        await self.repo.update_password(email, hashed)
        await self.reset_repo.delete_code(email)
        return ResetPasswordResponse(message="Password reset successfully")
