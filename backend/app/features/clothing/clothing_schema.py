from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ---- Upload ----

class ClothingUploadResponse(BaseModel):
    clothing_id: str
    image_url: str
    resized_url: Optional[str] = None
    category: str
    cloth_type: str
    name: Optional[str]
    created_at: datetime
    message: str


# ---- Item ----

class ClothingItem(BaseModel):
    id: str
    image_url: str
    resized_url: Optional[str]
    category: str
    cloth_type: str
    name: Optional[str]
    created_at: datetime


# ---- List ----

class ClothingListResponse(BaseModel):
    clothes: List[ClothingItem]


# ---- Update ----

class ClothingUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None


# ---- Delete ----

class ClothingDeleteResponse(BaseModel):
    message: str


# ---- Single ----

class ClothingDetailResponse(BaseModel):
    id: str
    image_url: str
    resized_url: Optional[str]
    category: str
    cloth_type: str
    name: Optional[str]
    created_at: datetime


# ---- Categories ----

class CategoryListResponse(BaseModel):
    categories: List[str]