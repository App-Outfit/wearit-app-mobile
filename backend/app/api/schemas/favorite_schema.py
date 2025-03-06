from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class FavoriteBase(BaseModel):
    """Base model for Favorite, used as a foundation for other schemas."""
    user_id: str = Field(..., description="User ID of the favorite owner")
    outfit: List[str] = Field(min_length=1, description="List of clothing item IDs in the favorite outfit", example=["id1", "id2"])

class FavoriteCreateResponse(BaseModel):
    """Response model after successfully creating a favorite."""
    id: str
    message: str = "Favorite created successfully"
    created_at: datetime

class FavoriteResponse(FavoriteBase):
    """Response model when fetching a favorite."""
    id: str

class FavoriteListResponse(BaseModel):
    """Response model when fetching multiple favorites."""
    favorites: List[FavoriteResponse]

class FavoriteDeleteResponse(BaseModel):
    """Response model after deleting a favorite."""
    message: str = "Favorite deleted successfully"