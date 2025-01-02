from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create an access token with an optional expiration time.

    This function generates a JWT (JSON Web Token) encoded with the provided data
    and an expiration time. The token is signed using the configured secret key
    and algorithm.

    Args:
        data (dict): The data to encode in the token.
        expires_delta (timedelta, optional): The duration until the token expires.
            If not provided, defaults to `ACCESS_TOKEN_EXPIRE_MINUTES`.

    Returns:
        str: The encoded JWT access token.
    """
    to_encode = data.copy()
        
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_password_hash(password: str) -> str:
    """Generate a hashed version of the given password.

    Args:
        password (str): The plaintext password to hash.

    Returns:
        str: The hashed password.
def create_reset_token(email: str, expires_delta: timedelta = None) -> str:
    """Create a password reset token with an optional expiration time.

    This function generates a JWT (JSON Web Token) containing the user's email
    address and an expiration time. The token is signed using the configured
    secret key and algorithm.

    Args:
        email (str): The email address of the user.
        expires_delta (timedelta, optional): The duration until the token expires.
            If not provided, defaults to 24 hours.

    Returns:
        str: The encoded JWT password reset token.
    """
    to_encode = {"sub": email}
    
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(hours=24)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_password_hash(password: str) -> str:
    """Generate a hashed version of the given password.

    Args:
        password (str): The plaintext password to hash.

    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password.

    Args:
        plain_password (str): The plaintext password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def verify_reset_token(token: str) -> str:
    """Verify the validity of a password reset token.

    This function decodes the provided token and verifies its signature using
    the configured secret key and algorithm.

    Args:
        token (str): The encoded JWT password reset token.

    Raises:
        HTTPException: If the token is invalid or has expired.

    Returns:
        str: The email address encoded in the token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise JWTError
        return email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")