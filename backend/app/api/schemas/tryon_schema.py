from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import List
from datetime import datetime
from uuid import UUID


class TryonBase(BaseModel):
    """Base model for Cloth, used as a foundation for other schemas."""
    body_id: UUID = Field(..., description="ID of the body to try on")
    cloth_id: UUID = Field(..., description="ID of the cloth to try on")

class TryonCreate(TryonBase):
    """Schema for creating a new cloth (input)."""
    pass

class TryonResponse(TryonBase):
    """Response model"""
    id: UUID = Field(..., description="Unique ID of the tryon")
    image_url: HttpUrl = Field(..., description="URL of the try-on image")

    @field_validator("image_url", mode="before")
    @classmethod
    def convert_url_to_string(cls, v):
        """Ensures the image URL is stored as a string."""
        return str(v)
    
class TryonListResponse(BaseModel):
    """Response model when fetching multiple try-ons."""
    tryons: List[TryonResponse]
