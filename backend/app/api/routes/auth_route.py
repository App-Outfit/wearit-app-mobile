from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging_config import logger
from app.services.auth_service import AuthService
from app.repositories.auth_repo import AuthRepository
from app.infrastructure.database.postgres import get_db  # Fonction pour récupérer la session
from app.core.config import GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI
from app.api.schemas.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    AuthGoogleResponse
)

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db: AsyncSession = Depends(get_db)):
    return AuthService(AuthRepository(db))

# ✅ POST sign up
@router.post("/signup", response_model=AuthSignupResponse)
async def signup(
    auth: AuthSignup,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to sign up")
    response = await service.signup(auth)
    if not response:
        raise HTTPException(status_code=400, detail="User creation failed")
    
    return response

# ✅ POST login
@router.post("/login", response_model=AuthLoginResponse)
async def login(
    auth: AuthLogin,
    service: AuthService = Depends(get_auth_service)
):
    logger.info(f"🔵 [API] Received POST request to log in")
    response = await service.login(auth)
    if not response:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return response

# ✅ GET Google login
@router.get("/google")
async def google_auth():
    """Redirige l'utilisateur vers Google pour l'authentification OAuth2"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email profile"
    )
    return {"auth_url": google_auth_url}

# ✅ GET Google callback
@router.get("/google/callback", response_model=AuthGoogleResponse)
async def google_callback(request: Request, service: AuthService = Depends(get_auth_service)):
    """Récupère le code de Google et authentifie l'utilisateur"""
    logger.info(f"🔵 [API] Received Google authentication callback")
    response = await service.google_login(request)
    if not response:
        raise HTTPException(status_code=400, detail="Google authentication failed")

    return response