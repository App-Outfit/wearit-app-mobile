from pydantic import BaseModel, Field
from typing import List, Optional

class FashionProduct(BaseModel):
    id: str = Field(..., alias="_id", description="MongoDB ObjectId as string")
    product_url: str
    s3_directory_key: Optional[str] = None
    title: str
    description: Optional[str] = ""
    gender: str
    price: float
    store_id: str
    image_urls: List[str]
    color_name: Optional[str] = None
    product_name: Optional[str] = None
    color_hex: Optional[str] = None
    category_name: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "6814f6224090d55e763c964e",
                "product_url": "https://www.zara.com/fr/fr/top-bustier-p03152016.html",
                "s3_directory_key": None,
                "title": "TOP BUSTIER - Marron clair",
                "description": "",
                "gender": "woman",
                "price": 25.95,
                "store_id": "zara",
                "image_urls": [
                    "https://static.zara.net/assets/public/ebd1/4c52/9c2b42a391b7/c3a953d30132/03152016730-p/03152016730-p.jpg"
                ],
                "color_name": "Marron clair",
                "product_name": "top-bustier",
                "color_hex": "#C19D86",
                "category_name": "femme-ensembles"
            }
        }
