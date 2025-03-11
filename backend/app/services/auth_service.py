from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.core.errors import ConflictError, NotFoundError, InternalServerError, UnauthorizedError, ValidationError
from jose import jwt
from fastapi import Request
from app.repositories.storage_repo import StorageRepository
import httpx
import secrets

from app.core.logging_config import logger
from app.core.config import (
    JWT_SECRET_KEY, JWT_ALGORITHM, 
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
)
from app.repositories.auth_repo import AuthRepository
from app.api.schemas.auth_schema import (
    AuthSignup, AuthSignupResponse,
    AuthLogin, AuthLoginResponse,
    AuthGoogleResponse
)

class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository
        self.storage = StorageRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        """Hash a password securely"""
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a hashed password"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict):
        """Create a JWT access token"""
        to_encode = data.copy()
        expire = datetime.now() + timedelta(minutes=60)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return encoded_jwt
    
    async def signup(self, user: AuthSignup):
        """Sign up a new user in PostgreSQL"""
        logger.info("🟡 [Service] Signing up new user")
        email = user.email.lower()
        password = user.password

        # Vérifier si l'utilisateur existe déjà
        existing_user = await self.repository.get_user_by_email(email)
        if existing_user:
            logger.error("🔴 [Service] User already exists")
            raise ConflictError("User already exists")

        # Hasher le mot de passe
        hashed_password = self.hash_password(password)

        # Créer et insérer l'utilisateur dans la base
        try:
            new_user = await self.repository.create_user(email, hashed_password, user.name)
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Service] Database error: {e}")
            raise InternalServerError("Database error")

        # Générer un JWT token
        access_token = self.create_access_token(data={"sub": new_user.email})
        logger.debug("🟢 [Service] User signed up successfully")
        return AuthSignupResponse(message="Signed up successfully", token=access_token)
    
    async def login(self, user: AuthLogin):
        """Log in a user"""
        logger.info("🟡 [Service] Logging in user")
        email = user.email.lower()
        password = user.password

        # Récupérer l'utilisateur
        existing_user = await self.repository.get_user_by_email(email)
        if not existing_user:
            logger.error("🔴 [Service] User not found")
            raise NotFoundError("User not found")
        
        # Vérifier le mot de passe
        if not self.verify_password(password, existing_user.password):
            logger.error("🔴 [Service] Incorrect password")
            raise UnauthorizedError("Incorrect password")
        
        # Générer un JWT token
        access_token = self.create_access_token(data={"sub": existing_user.email})
        logger.debug("🟢 [Service] User logged in successfully")
        return AuthLoginResponse(message="Logged in successfully", token=access_token)
    
    async def google_login(self, request: Request):
        """Log in a user with Google"""
        logger.info("🟡 [Service] Processing Google login")

        # ✅ Récupérer le code d'authentification depuis les paramètres de l'URL
        code = request.query_params.get("code")

        if not code:
            logger.error("🔴 [Service] No authorization code received from Google")
            raise ValidationError("No authorization code received from Google")

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
            raise InternalServerError("Failed to get access token from Google")

        access_token = token_data["access_token"]

        # 📡 Récupérer les informations utilisateur
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}

        async with httpx.AsyncClient() as client:
            user_response = await client.get(user_info_url, headers=headers)
            user_info = user_response.json()

        if "email" not in user_info:
            logger.error(f"🔴 [Service] Failed to retrieve user info from Google: {user_info}")
            raise InternalServerError("Failed to retrieve user info from Google")

        email = user_info["email"]

        # 📦 Vérifier si l'utilisateur existe déjà
        existing_user = await self.repository.get_user_by_email(email)

        if existing_user is None:
            # Créer un nouvel utilisateur si nécessaire
            try:
                random_password = secrets.token_urlsafe(32)
                hashed_password = self.hash_password(random_password)
                new_user = await self.repository.create_user(email, hashed_password, user_info.get("name", "Google User"))
            except SQLAlchemyError as e:
                logger.error(f"🔴 [Service] Failed to create Google user: {e}")
                raise InternalServerError("Failed to create user")
            
            logger.debug("🟢 [Service] Created new user with Google login")

        # 🔑 Générer un JWT token pour l'utilisateur
        access_token = self.create_access_token(data={"sub": email})
        logger.debug("🟢 [Service] User logged in with Google successfully")

        return AuthGoogleResponse(
            message="Logged in with Google successfully",
            token=access_token
        )
    
    async def logout(self):
        """
        Pour un système JWT stateless, le logout se gère souvent côté client.
        Ici, on renvoie simplement un message indiquant que le logout a réussi.
        """
        # Si tu souhaites implémenter une révocation de token, c'est ici que tu le ferais.
        logger.info("🟢 [Service] Logout successful")
        return {"message": "Logged out successfully"}

    async def delete_account(self, user):
        """
        Supprime le compte de l'utilisateur connecté.
        `user` doit être l'objet utilisateur actuellement authentifié.
        """
        logger.info(f"🟡 [Service] Deleting account for user {user.id}")
        try:
            # Supprimer l'utilisateur de S3
            deleted_images = await self.storage.delete_account_images(user.id)
            if not deleted_images:
                logger.error("🔴 [Service] Failed to delete user images from S3")
                raise InternalServerError("Failed to delete user images")
            
            # Supprimer l'utilisateur de PostgreSQL
            deleted = await self.repository.delete_user_by_id(user.id)
            if not deleted:
                logger.error("🔴 [Service] Failed to delete user from PostgreSQL")
                raise InternalServerError("Failed to delete user")
            
            logger.debug("🟢 [Service] Account deleted successfully")
            return {"message": "Account deleted successfully"}
        except SQLAlchemyError as e:
            logger.error(f"🔴 [Service] Database error: {e}")
            raise InternalServerError("Database error")