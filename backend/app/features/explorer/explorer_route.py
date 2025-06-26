from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from .explorer_service import ExplorerService
from .explorer_schema import SearchClothingPayload
from .pinterest_scraper import PinterestScraper
from typing import List
from .explorer_model import ProductsPage

pinterest_scraper = PinterestScraper()
router = APIRouter(prefix="/explorer", tags=["Explorer"])


def get_explorer_service():
    return ExplorerService()


@router.post("/search-clothes", response_model=ProductsPage)
async def search_clothes(
    payload: SearchClothingPayload,
    service: ExplorerService = Depends(get_explorer_service),
):
    """
    Search for clothes on Pinterest.
    """
    return service.search_clothes(payload)
