# app/features/tryon/tryon_schema.py

from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

# ---- Create Tryon ----
class TryonCreateRequest(BaseModel):
    body_id: str
    clothing_id: str

class TryonCreateResponse(BaseModel):
    tryon_id: str
    status: str
    message: str
    version: int

# ---- Item ----
class TryonItem(BaseModel):
    id: str
    body_id: str
    clothing_id: str
    output_url: Optional[str] = None
    status: str
    created_at: datetime
    version: int

# ---- Detail ----
class TryonDetailResponse(TryonItem):
    updated_at: datetime
    version: int

# ---- List ----
class TryonListResponse(BaseModel):
    tryons: List[TryonItem]

# ---- Delete ----
class TryonDeleteResponse(BaseModel):
    message: str
