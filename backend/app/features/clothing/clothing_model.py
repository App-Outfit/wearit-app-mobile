# app/features/clothing/clothing_model.py

from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.core.pyobject import PyObjectId

class ClothingModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId

    image_url: str
    resized_url: Optional[str] = None

    category: str  
    name: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @field_serializer("id", "user_id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = ConfigDict(
        validate_by_name=True,
        arbitrary_types_allowed=True
    )
