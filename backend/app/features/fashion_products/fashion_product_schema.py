from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from .fashion_product_model import FashionProduct

class ProductListQuery(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    search: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class ProductListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    products: List[FashionProduct]

class ProductFiltersResponse(BaseModel):
    brands: List[str]
    categories: List[str]
    colors: List[str]
    genders: List[str]
