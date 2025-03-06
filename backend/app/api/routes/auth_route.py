from fastapi import APIRouter, Depends, Request
from app.core.logging_config import logger
from app.services.auth_service import AuthService
from app.repositories.auth_repo import AuthRepository
from app.core.config import GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI
from app.api.schemas.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    AuthGoogle, AuthGoogleResponse
)

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(repo: AuthRepository = Depends()):
    return AuthService(repo)

# POST sign up
@router.post("/signup", response_model=AuthSignupResponse)
async def signup(
    auth: AuthSignup,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to sign up")
    return await service.signup(auth)

# POST login
@router.post("/login", response_model=AuthLoginResponse)
async def login(
    auth: AuthLogin,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to log in")
    return await service.login(auth)

# GET google login
@router.get("/google")
async def google_auth():
    """Redirige l'utilisateur vers Google pour l'authentification"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email profile"
    )
    return {"auth_url": google_auth_url}

# Endpoint pour traiter la réponse de Google
@router.get("/google/callback", response_model=AuthGoogleResponse)
async def google_callback(request: Request, service: AuthService = Depends(get_auth_service)):
    """Récupère le code de Google et authentifie l'utilisateur"""
    logger.info(f"🔵 [API] Received Google authentication callback")
    return await service.google_login(request)