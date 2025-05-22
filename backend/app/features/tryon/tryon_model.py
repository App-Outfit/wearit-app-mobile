# tryon_model.py
from pydantic import BaseModel, Field, field_serializer
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId
from app.core.pyobject import PyObjectId


class TryonModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    body_id: PyObjectId
    clothing_id: PyObjectId

    output_url: Optional[str] = None
    version: int
    status: Optional[Literal["pending", "ready"]] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @field_serializer("id", "user_id", "body_id", "clothing_id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True
    }
