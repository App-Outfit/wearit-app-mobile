from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

# -----------------------
# User Profile
# -----------------------

class UserProfileResponse(BaseModel):
    user_id: str
    first_name: Optional[str]
    email: str
    credits: int
    referral_code: Optional[str]
    answers: Optional[Dict[str, str]] = None

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    answers: Optional[Dict[str, str]] = None

# -----------------------
# Credits
# -----------------------

class CreditsResponse(BaseModel):
    user_id: str
    credits: int
    updated_at: datetime

# -----------------------
# Referral
# -----------------------

class ReferralCodeResponse(BaseModel):
    referral_code: str
