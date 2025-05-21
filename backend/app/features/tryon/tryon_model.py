# tryon_model.py
from pydantic import BaseModel, Field
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

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
