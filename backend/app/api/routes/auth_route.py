from fastapi import APIRouter, Depends, Request, HTTPException
from app.core.logging_config import logger
from app.services.auth_service import AuthService
from app.repositories.auth_repo import AuthRepository
from app.repositories.storage_repo import StorageRepository
from app.api.dependencies import get_current_user, get_db
from app.core.config import settings
from app.api.schemas.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    AuthGoogleResponse, AuthLogoutResponse,
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

# ✅ GET Google login
@router.get("/google")
async def google_auth():
    """Redirige l'utilisateur vers Google pour l'authentification OAuth2"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email profile"
    )
    return {"auth_url": google_auth_url}

# ✅ GET Google callback
@router.get("/google/callback", response_model=AuthGoogleResponse)
async def google_callback(request: Request, service: AuthService = Depends(get_auth_service)):
    """Récupère le code de Google et authentifie l'utilisateur"""
    logger.info(f"🔵 [API] Received Google authentication callback")
    return await service.google_login(request)

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