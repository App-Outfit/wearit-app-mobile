import json

from pydantic import BaseModel, Field
from typing import List, Union, Optional


class SearchClothingPayload(BaseModel):
    query: str = Field(..., description="Search query for clothing")
    bookmark: Optional[str] = Field(
        default=None, description="Bookmark for pagination, if available"
    )
    csrf_token: Optional[str] = Field(
        default=None, description="CSRF token for session validation, if available"
    )
    gender: Optional[str] = Field(default=None,description="")
