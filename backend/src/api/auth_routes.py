from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from src.services.auth_service import create_user, authenticate_user, request_password_reset, reset_password
from src.exceptions.error_handler import handle_errors

router = APIRouter()

class UserSignup(BaseModel):
    """Schema for user signup information."""
    name: str
    email: EmailStr
    password: str

class UserSignin(BaseModel):
    """Schema for user signin information."""
    email: EmailStr
    password: str

class ForgotPassword(BaseModel):
    """Schema for requesting a password reset."""
    email: EmailStr

class ResetPassword(BaseModel):
    """Schema for resetting a user's password."""
    token: str
    new_password: str

@router.post("/signup", summary="Create a new user")
@handle_errors
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

@router.post("/signin", summary="Sign in as an existing user")
@handle_errors
async def signin(user: UserSignin) -> dict:
    """Sign in as an existing user and return an access token.

    This endpoint allows an existing user to sign in by providing their email 
    and password. It returns a JWT access token upon successful authentication.

    Args:
        user (UserSignin): The user information required for signin.

    Returns:
        dict: A dictionary containing the access token and its type.
    """
    access_token = await authenticate_user(user.email, user.password)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", summary="Request a password reset")
@handle_errors
async def forgot_password(data: ForgotPassword) -> dict:
    """Request a password reset for the given email address.

    This endpoint sends a password reset email to the user with a token that 
    can be used to reset their password.

    Args:
        data (ForgotPassword): The email address of the user.

    Returns:
        dict: A success message indicating that the email was sent.
    """
    await request_password_reset(data.email)
    return {"message": "Password reset email sent"}

@router.post("/reset-password", summary="Reset a user's password")
@handle_errors
async def reset_password_route(data: ResetPassword) -> dict:
    """Reset a user's password using a password reset token.

    This endpoint allows a user to reset their password by providing a valid 
    password reset token and a new password.

    Args:
        data (ResetPassword): The password reset token and new password.

    Returns:
        dict: A success message indicating that the password was reset.
    """
    await reset_password(data.token, data.new_password)
    return {"message": "Password reset successful"}