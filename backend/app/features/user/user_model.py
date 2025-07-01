from pydantic import BaseModel, EmailStr, Field, field_serializer
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

    credits: int = 0
    referral_code: Optional[str] = None
    ref_by: Optional[PyObjectId] = None

    answers: Optional[Dict[str, str]] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @field_serializer("id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True
    }

class UserInDB(UserModel):
    password: str
