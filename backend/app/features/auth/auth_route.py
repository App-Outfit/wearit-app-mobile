from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from .auth_service import AuthService
from .auth_repo import AuthRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.database.dependencies import get_current_user, get_db
from app.core.config import settings
from .auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse, AuthLogoutResponse,
    AuthDeleteResponse, ForgotPasswordResponse,
    ResetPasswordResponse, ResetPasswordRequest,
    ForgotPasswordRequest, VerifyResetCodeRequest,
    VerifyResetCodeResponse
)

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db = Depends(get_db)):
    return AuthService(AuthRepository(db), storage=StorageRepository())

# ✅ POST sign up
@router.post("/signup", response_model=AuthSignupResponse)
async def signup(
    auth: AuthSignup,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to sign up")
    return await service.signup(auth)

# ✅ POST login
@router.post("/login", response_model=AuthLoginResponse)
async def login(
    auth: AuthLogin,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to log in")
    return await service.login(auth)

# ✅ POST logout
@router.post("/logout", response_model=AuthLogoutResponse)
async def logout(service: AuthService = Depends(get_auth_service)):
    """
    Logout endpoint.
    Pour une authentification JWT stateless, le serveur demande simplement au client de supprimer son token.
    """
    return await service.logout()

# ✅ DELETE account
@router.delete("/account", response_model=AuthDeleteResponse)
async def delete_account(
    current_user = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service)
):
    """
    Delete account endpoint.
    Supprime le compte de l'utilisateur actuellement connecté.
    """
    return await service.delete_account(current_user)

@router.post("/forgot-password", response_model=ForgotPasswordResponse, summary="Request a password reset code")
async def forgot_password(
    payload: ForgotPasswordRequest,
    service: AuthService = Depends(get_auth_service)
):
    return await service.forgot_password(payload)

@router.post("/forgot-password/verify", response_model=VerifyResetCodeResponse, summary="Verify the reset code")
async def verify_reset_code(
    payload: VerifyResetCodeRequest,
    service: AuthService = Depends(get_auth_service)
):
    return await service.verify_reset_code(payload)

@router.post("/reset-password", response_model=ResetPasswordResponse, summary="Reset the password")
async def reset_password(
    payload: ResetPasswordRequest,
    service: AuthService = Depends(get_auth_service)
):
    return await service.reset_password(payload)