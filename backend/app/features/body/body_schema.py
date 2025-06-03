# app/features/body/body_schema.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# -----------------------
# Body Upload
# -----------------------

class BodyUploadResponse(BaseModel):
    body_id: str
    status: str = "pending"
    message: str

# -----------------------
# Body Item (used in list)
# -----------------------

class BodyItem(BaseModel):
    id: str
    image_url: str
    mask_upper: Optional[str] = None
    mask_lower: Optional[str] = None
    mask_dress: Optional[str] = None
    status: str
    is_default: bool
    created_at: datetime

class BodyListResponse(BaseModel):
    bodies: List[BodyItem]

# -----------------------
# Body Masks
# -----------------------

class BodyMasksResponse(BaseModel):
    mask_upper: Optional[str]
    mask_lower: Optional[str]
    mask_dress: Optional[str]