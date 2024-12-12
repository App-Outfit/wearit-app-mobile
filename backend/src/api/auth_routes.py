from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from services.auth_service import create_user

router = APIRouter()

class UserSignup(BaseModel):
    """Schema for user signup information.

    Attributes:
        name (str): The name of the user.
        email (EmailStr): The email address of the user.
        password (str): The plaintext password of the user.
    """
    name: str
    email: EmailStr
    password: str

@router.post("/signup", summary="Create a new user")
async def signup(user: UserSignup) -> dict:
    """Create a new user and return an access token.

    This endpoint allows a new user to sign up by providing their name, email, 
    and password. It returns a JWT access token upon successful creation.

    Args:
        user (UserSignup): The user information required for signup.

    Returns:
        dict: A dictionary containing the access token and its type.
    """
    access_token = await create_user(user.name, user.email, user.password)
    return {"access_token": access_token, "token_type": "bearer"}
