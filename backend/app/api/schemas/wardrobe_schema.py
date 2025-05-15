# app/api/schemas/wardrobe_schema.py

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from typing import List

# -----------------------
# Cloth
# -----------------------

class ClothCreate(BaseModel):
    user_id: str
    name: str
    type: str
    tags: List[str] = Field(default_factory=list)

class ClothCreateResponse(BaseModel):
    id: UUID
    image_url: str
    tags: List[str]
    created_at: datetime
    message: str

class ClothResponse(BaseModel):
    id: UUID
    user_id: str
    name: str
    type: str
    image_url: str
    tags: List[str]

class ClothListResponse(BaseModel):
    clothes: List[ClothResponse]

class ClothDeleteResponse(BaseModel):
    message: str

# -----------------------
# Outfit
# -----------------------

class OutfitCreate(BaseModel):
    user_id: str
    body_id: UUID
    cloth_ids: List[UUID]

class OutfitCreateResponse(BaseModel):
    id: UUID
    body_id: UUID
    cloth_ids: List[UUID]
    created_at: datetime
    message: str

class OutfitResponse(BaseModel):
    id: UUID
    user_id: str
    body_id: UUID
    cloth_ids: List[UUID]
    created_at: datetime

class OutfitListResponse(BaseModel):
    outfits: List[OutfitResponse]

class OutfitDeleteResponse(BaseModel):
    message: str
