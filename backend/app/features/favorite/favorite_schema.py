from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class FavoriteCreateRequest(BaseModel):
    body_id: str
    clothing_ids: List[str]

class FavoriteResponse(BaseModel):
    id: str
    body_id: str
    clothing_ids: List[str]
    created_at: datetime
    updated_at: datetime

# -----------------------
# List
# -----------------------

class FavoriteListResponse(BaseModel):
    favorites: List[FavoriteResponse]

# -----------------------
# Delete
# -----------------------

class FavoriteDeleteResponse(BaseModel):
    message: str
