from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId
from pydantic_core.core_schema import ValidationInfo
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema
from typing import Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: GetCoreSchemaHandler) -> core_schema.CoreSchema:
        return core_schema.no_info_wrap_validator_function(cls.validate, core_schema.str_schema())

    @classmethod
    def validate(cls, v: Any, info: ValidationInfo) -> ObjectId:
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

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
        allow_population_by_field_name = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
        orm_mode = True

class UserInDB(UserModel):
    password: str
