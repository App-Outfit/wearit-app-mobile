from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId
from app.core.pyobject import PyObjectId

# ---------------------------
# User in MongoDB
# ---------------------------

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    email: Optional[EmailStr] = None
    device_id: Optional[str] = None

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None

    credits: int = 0
    referral_code: Optional[str] = None
    ref_by: Optional[PyObjectId] = None

    answers: Optional[Dict[str, str]] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}

class UserInDB(UserModel):
    password: str
