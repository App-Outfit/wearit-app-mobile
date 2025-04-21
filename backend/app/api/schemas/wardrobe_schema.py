from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Literal, List
from datetime import datetime
from fastapi import UploadFile, File
from uuid import UUID


class ClothBase(BaseModel):
    """Base model for Cloth, used as a foundation for other schemas."""
    user_id: UUID = Field(..., description="User ID of the cloth owner")
    name: str = Field(..., min_length=1, description="Name of the cloth")
    type: Literal["upper", "lower", "dress"] = Field(..., description="Type of the cloth")


class ClothCreate(ClothBase):
    """Schema for creating a new cloth (input)."""
    file: UploadFile = File(..., description="Image file of the cloth")


class ClothResponse(ClothBase):
    """Response model when fetching a cloth."""
    id: UUID = Field(..., description="Unique ID of the cloth")
    image_url: HttpUrl = Field(..., description="URL of the cloth image")

    @field_validator("image_url", mode="before")
    @classmethod
    def convert_url_to_string(cls, v):
        """Ensures the image URL is stored as a string."""
        return str(v)
    

class ClothCreateResponse(BaseModel):
    """Response model after successfully creating a cloth."""
    id: UUID = Field(..., description="Unique ID of the cloth")
    message: str = "Cloth created successfully"
    created_at: datetime
    image_url: HttpUrl = Field(..., description="URL of the cloth image")

    @field_validator("image_url", mode="before")
    @classmethod
    def convert_url_to_string(cls, v):
        """Ensures the image URL is stored as a string."""
        return str(v)



class ClothListResponse(BaseModel):
    """Response model when fetching multiple clothes."""
    clothes: List[ClothResponse]


class ClothDeleteResponse(BaseModel):
    """Response model after deleting a cloth."""
    message: str = "Cloth deleted successfully"
