from app.core.errors import ConflictError
from app.core.logging_config import logger
from datetime import datetime
from passlib.context import CryptContext
from jose import jwt
from app.core.config import JWT_SECRET_KEY, JWT_ALGORITHM, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from datetime import timedelta
from app.repositories.auth_repo import AuthRepository
from fastapi import Request
import httpx
from app.api.schemas.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    AuthGoogleResponse,
)

class AuthService:
    def __init__(self, repository: AuthRepository = None):
        self.repository = repository or AuthRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        """Hash a password"""
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict):
        """Create an access token"""
        to_encode = data.copy()
        expire = datetime.now() + timedelta(minutes=60)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return encoded_jwt
    
    async def signup(self, user: AuthSignup):
        """Sign up a new user"""
        logger.info(f"🟡 [Service] Signing up new user")
        email = user.email.lower()
        password = user.password

        # Check if user already exists
        existing_user = await self.repository.get_user_by_email(email)
        if existing_user:
            logger.error(f"🔴 [Service] User already exists")
            raise ConflictError("User already exists")
        
        # Hash password
        hashed_password = self.hash_password(password)

        # Create user
        new_user = {
            "email": email,
            "hashed_password": hashed_password,
            "created_at": datetime.now()
        }

        # Insert user into database
        user_id = await self.repository.create_user(new_user)

        if user_id is None:
            logger.error(f"🔴 [Service] Failed to create user")
            raise ConflictError("Failed to create user")
        
        # Generate JWT token
        access_token = self.create_access_token(data={"sub": email})
        logger.debug(f"🟢 [Service] User signed up successfully")
        return AuthSignupResponse(message="Signed up successfully", token=access_token)
    
    async def login(self, user: AuthLogin):
        """Log in a user"""
        logger.info(f"🟡 [Service] Logging in user")
        email = user.email.lower()
        password = user.password

        # Get user by email
        existing_user = await self.repository.get_user_by_email(email)

        if existing_user is None:
            logger.error(f"🔴 [Service] User not found")
            raise ConflictError("User not found")
        
        # Verify password
        if not self.verify_password(password, existing_user["hashed_password"]):
            logger.error(f"🔴 [Service] Incorrect password")
            raise ConflictError("Incorrect password")
        
        # Generate JWT token
        access_token = self.create_access_token(data={"sub": email})
        logger.debug(f"🟢 [Service] User logged in successfully")
        return AuthLoginResponse(message="Logged in successfully", token=access_token)
    
    async def google_login(self, request: Request):
        """Log in a user with Google"""
        logger.info(f"🟡 [Service] Processing Google login")

        # ✅ Récupérer le code d'authentification depuis les paramètres de l'URL
        code = request.query_params.get("code")

        if not code:
            logger.error("🔴 [Service] No authorization code received from Google")
            raise ValueError("No authorization code received from Google")

        # 📡 Échanger le code contre un access token
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            token_data = response.json()

        if "access_token" not in token_data:
            logger.error(f"🔴 [Service] Failed to get access token from Google: {token_data}")
            raise ValueError("Failed to get access token from Google")

        access_token = token_data["access_token"]

        # 📡 Récupérer les informations utilisateur
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}

        async with httpx.AsyncClient() as client:
            user_response = await client.get(user_info_url, headers=headers)
            user_info = user_response.json()

        if "email" not in user_info:
            logger.error(f"🔴 [Service] Failed to retrieve user info from Google: {user_info}")
            raise ValueError("Failed to retrieve user info from Google")

        email = user_info["email"]

        # 📦 Vérifier si l'utilisateur existe déjà
        existing_user = await self.repository.get_user_by_email(email)

        if existing_user is None:
            # Créer un nouvel utilisateur si nécessaire
            new_user = {
                "email": email,
                "created_at": datetime.now()
            }
            user_id = await self.repository.create_user(new_user)

            if user_id is None:
                logger.error(f"🔴 [Service] Failed to create user")
                raise ConflictError("Failed to create user")
            
            logger.debug(f"🟢 [Service] Created new user with Google login")

        # 🔑 Générer un JWT token pour l'utilisateur
        access_token = self.create_access_token(data={"sub": email})
        logger.debug(f"🟢 [Service] User logged in with Google successfully")

        return AuthGoogleResponse(
            message="Logged in with Google successfully",
            token=access_token
        )
