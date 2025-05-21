from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict

# -----------------------
# BaseAuth
# -----------------------

class BaseAuth(BaseModel):
    """Base model for authentication (used for login/signup)."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=128, description="User's password")

# -----------------------
# Signup
# -----------------------

class AuthSignup(BaseAuth):
    """Request model for signing up."""
    first_name: Optional[str] = Field(None, description="User's first name")
    gender: Optional[str] = Field(None, description="User's gender (optional)")
    answers: Optional[Dict[str, str]] = Field(default_factory=dict, description="Custom answers to onboarding questions")
    referral_code: Optional[str] = Field(None, description="Referral code received from another user")

class AuthSignupResponse(BaseModel):
    """Response model after successfully signing up."""
    message: str = Field("Signed up successfully", description="Signup success message")
    token: str = Field(..., description="JWT token for authentication")

# -----------------------
# Login
# -----------------------

class AuthLogin(BaseAuth):
    """Request model for logging in."""
    pass

class AuthLoginResponse(BaseModel):
    """Response model after successfully logging in."""
    message: str = Field("Logged in successfully", description="Login success message")
    token: str = Field(..., description="JWT token for authentication")

# -----------------------
# Logout
# -----------------------

class AuthLogoutResponse(BaseModel):
    """Response model after logging out."""
    message: str = Field("Logged out successfully", description="Logout success message")

# -----------------------
# Delete Account
# -----------------------

class AuthDeleteResponse(BaseModel):
    """Response model after deleting an account."""
    message: str = Field("Account deleted successfully", description="Account deletion confirmation")

# -----------------------
# Forgot Password
# -----------------------

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Email to send reset code to")

class ForgotPasswordResponse(BaseModel):
    message: str = Field(..., description="Message confirming reset code sent")

# -----------------------
# Verify Reset Code
# -----------------------

class VerifyResetCodeRequest(BaseModel):
    email: EmailStr = Field(..., description="Email associated with the reset code")
    code: str = Field(..., min_length=4, max_length=4, description="4-digit reset code")

class VerifyResetCodeResponse(BaseModel):
    valid: bool = Field(..., description="Indicates whether the reset code is valid")

# -----------------------
# Reset Password
# -----------------------

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    code: str = Field(..., min_length=4, max_length=4, description="4-digit reset code")
    new_password: str = Field(..., min_length=8, description="New password (min. 8 chars)")

class ResetPasswordResponse(BaseModel):
    message: str = Field(..., description="Confirmation message after password reset")