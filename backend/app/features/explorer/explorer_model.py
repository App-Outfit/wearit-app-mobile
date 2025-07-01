import json

from pydantic import BaseModel, Field
from typing import List, Union, Optional


class PinterestProduct(BaseModel):
    product_url: Optional[str] = Field(
        default=None, description="URL of the Pinterest product page"
    )
    description: Optional[str] = Field(
        default=None, description="Description of the Pinterest product"
    )
    image_url: str = Field(
        default=None, description="Image URL of the Pinterest product"
    )
    query: str = Field(
        default=None, description="Search query used to find the product"
    )
    pinterest_url: Optional[str] = Field(
        default=None, description="URL of the Pinterest page for the product"
    )


class ProductsPage(BaseModel):
    products: List[PinterestProduct] = Field(
        default=[],
        description="List of products with their URLs, descriptions, and image URLs",
    )
    bookmark: Optional[str] = Field(
        default=None,
        description="Bookmark for pagination, if available",
    )
    csrf_token: Optional[str] = Field(
        default=None,
        description="CSRF token for session validation, if available",
    )
    language: str = Field(
        default="en",
        description="Language of the Pinterest page, default is French",
    )


class KeywordsClothingQuery(BaseModel):
    clothing_type: str = Field(..., description="Type of clothing to search for")
    color: str = Field(..., description="Color of the clothing")
    size_adjective: str = Field(..., description="Size adjective of the clothing")
    gender: str = Field(..., description="Gender of the clothing")
    color_adjective: Optional[str] = Field(
        default=None,
        description="Color adjective of the clothing, optional",
    )
    language: str = Field(
        default="en",
        description="Language of the query, default is French",
    )
