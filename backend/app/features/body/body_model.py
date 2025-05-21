# app/features/body/body_model.py

from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import Optional
from app.core.pyobject import PyObjectId

class BodyModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., description="ID Mongo de l'utilisateur")
    image_url: str
    mask_upper: Optional[str] = None
    mask_lower: Optional[str] = None
    mask_dress: Optional[str] = None
    is_default: bool = False
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        orm_mode = True
