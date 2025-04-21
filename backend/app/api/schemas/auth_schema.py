from pydantic import BaseModel, Field, EmailStr

class BaseAuth(BaseModel):
    """Base model for authentication."""
    email: EmailStr = Field(..., description="Email of the user")
    password: str = Field(..., min_length=8, max_length=128, description="Password of the user")


class AuthSignup(BaseAuth):
    """Request model for signing up."""
    name: str = Field(..., min_length=2, max_length=50, description="Name of the user")
    answers: dict[str, str]

class AuthSignupResponse(BaseModel):
    """Response model after successfully signing up."""
    message: str = "Signed up successfully"
    token: str = Field(..., description="JWT token for authentication")

class AuthLogin(BaseAuth):
    """Request model for logging in."""
    pass
class AuthLoginResponse(BaseModel):
    """Response model after successfully logging in."""
    message: str = "Logged in successfully"
    token: str = Field(..., description="JWT token for authentication")

class AuthGoogle(BaseModel):
    """Request model for logging in with Google."""
    id_token: str = Field(..., description="Google ID token")

class AuthGoogleResponse(BaseModel):
    """Response model after successfully logging in with Google."""
    message: str = "Logged in with Google successfully"
    token: str = Field(..., description="JWT token for authentication")

class AuthLogoutResponse(BaseModel):
    """Response model after logging out."""
    message: str = Field("Logged out successfully", description="Message after logging out")

class AuthDeleteResponse(BaseModel):
    """Response model after deleting an account."""
    message: str = Field("Account deleted successfully", description="Message after deleting an account")

# 1) Request a reset code
class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(
        ..., 
        description="The email address where the reset code will be sent"
    )

class ForgotPasswordResponse(BaseModel):
    message: str = Field(
        ..., 
        description="Confirmation that a reset code has been sent"
    )

# 2) Verify the reset code
class VerifyResetCodeRequest(BaseModel):
    email: EmailStr = Field(
        ..., 
        description="The email address associated with the account"
    )
    code: str = Field(
        ..., 
        min_length=4, max_length=4,
        description="4‑digit reset code received by email"
    )

class VerifyResetCodeResponse(BaseModel):
    valid: bool = Field(
        ..., 
        description="Whether the provided reset code is valid"
    )

# 3) Perform the password reset
class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(
        ..., 
        description="The email address associated with the account"
    )
    code: str = Field(
        ..., 
        min_length=4, max_length=4,
        description="4‑digit reset code received by email"
    )
    new_password: str = Field(
        ..., 
        min_length=8,
        description="New password (at least 8 characters)"
    )

class ResetPasswordResponse(BaseModel):
    message: str = Field(
        ..., 
        description="Confirmation that the password has been successfully reset"
    )