from src.services.mongodb_service import mongodb_service
from src.services.email_service import send_reset_email
from src.config.security import create_access_token, get_password_hash, verify_password, create_reset_token, verify_reset_token
from fastapi import HTTPException, status
from datetime import timedelta

async def create_user(name: str, email: str, password: str) -> str:
    """Create a new user in the database and return an access token.

    This function hashes the user's password, saves the user to the database,
    and generates a JWT access token valid for 60 minutes.

    Args:
        name (str): The name of the user.
        email (str): The email address of the user.
        password (str): The plaintext password of the user.

    Raises:
        HTTPException: If a user with the provided email already exists in the database.

    Returns:
        str: A JWT access token for the newly created user.
    """
    existing_user = await mongodb_service.find_user_by_email(email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    hashed_password = get_password_hash(password)
    result = await mongodb_service.create_user(name, email, hashed_password)

    access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=60))
    return access_token

async def authenticate_user(email: str, password: str) -> str:
    """Authenticate an existing user and return an access token.

    This function retrieves the user from the database, verifies the password,
    and generates a JWT access token valid for 60 minutes.

    Args:
        email (str): The email address of the user.
        password (str): The plaintext password of the user.

    Raises:
        HTTPException: If the user does not exist or the password is incorrect.

    Returns:
        str: A JWT access token for the authenticated user.
    """
    user = await mongodb_service.find_user_by_email(email)
    if not user or not user["password"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")
    
    if not user["password"] or not verify_password(password, user["password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=60))
    return access_token

async def request_password_reset(email: str):
    """Génère un token de réinitialisation et envoie un e-mail.

    Args:
        email (str): L'email de l'utilisateur.

    Raises:
        HTTPException: Si l'utilisateur n'existe pas.
    """
    user = await mongodb_service.find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    reset_token = create_reset_token(email)
    send_reset_email(email, reset_token)
    return {"message": "Password reset email sent"}

async def reset_password(token: str, new_password: str):
    """Réinitialise le mot de passe avec le token de réinitialisation.

    Args:
        token (str): Le token de réinitialisation.
        new_password (str): Le nouveau mot de passe.

    Raises:
        HTTPException: Si le token est invalide ou l'utilisateur n'existe pas.
    """
    email = verify_reset_token(token)
    user = await mongodb_service.find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = get_password_hash(new_password)
    await mongodb_service.update_user_password(email, hashed_password)
    return {"message": "Password successfully reset"}

async def authenticate_google_user(user_info: dict) -> str:
    """Authenticate or create a user via Google OAuth and return an access token.

    Args:
        user_info (dict): User information received from Google.

    Returns:
        str: A JWT access token for the authenticated or newly created user.
    """
    email = user_info.get("email")
    name = user_info.get("name")

    if not email or not name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user information from Google")

    # Vérifie si l'utilisateur existe déjà dans la base de données
    user = await mongodb_service.find_user_by_email(email)

    # Si l'utilisateur n'existe pas, crée un nouvel utilisateur sans mot de passe
    if not user:
        await mongodb_service.create_user(name=name, email=email, password=None)

    # Génère un token JWT pour l'utilisateur
    access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=60))
    return access_token