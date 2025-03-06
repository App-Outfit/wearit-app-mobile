from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Literal, List
from datetime import datetime
from fastapi import UploadFile, File

class BodyBase(BaseModel):
    """Base model for Body, used as a foundation for other schemas."""
    user_id: str = Field(..., description="User ID of the body owner")

class BodyCreateResponse(BaseModel):
    """Response model after successfully creating a body."""
    id: str
    message: str = "Body created successfully"
    created_at: datetime
    image_url: HttpUrl = Field(..., description="URL of the body image")

    @field_validator("image_url", mode="before")
    @classmethod
    def convert_url_to_string(cls, v):
        """Ensures the image URL is stored as a string."""
        return str(v)
    
class BodyResponse(BodyBase):
    """Response model when fetching a body."""
    id: str
    image_url: HttpUrl = Field(..., description="URL of the body image")

    @field_validator("image_url", mode="before")
    @classmethod
    def convert_url_to_string(cls, v):
        """Ensures the image URL is stored as a string."""
        return str(v)
    
class BodyListResponse(BaseModel):
    """Response model when fetching multiple bodies."""
    bodies: List[BodyResponse]

class BodyDeleteResponse(BaseModel):
    """Response model after deleting a body."""
    message: str = "Body deleted successfully"

    