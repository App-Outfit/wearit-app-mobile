from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Literal
from datetime import datetime

class ClothBase(BaseModel):
    user_id: str = Field(..., description="User ID of the cloth owner")
    name: str = Field(..., min_length=1, description="Name of the cloth")
    type: Literal["upper", "lower", "dress"] = Field(..., description="Type of the cloth")
    image_url: HttpUrl = Field(..., description="URL of the cloth image")

    @field_validator("image_url")
    def convert_url_to_string(cls, v):
        # Convert HttpUrl to string before saving to MongoDB
        return str(v)

class ClothCreate(ClothBase):
    pass

class ClothResponse(ClothBase):
    id: str

class ClothCreateResponse(ClothResponse):
    message: str
    created_at: datetime
