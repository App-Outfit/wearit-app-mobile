# app/features/body/body_model.py

from pydantic import BaseModel, Field, field_serializer
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
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @field_serializer("id", "user_id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True
    }
