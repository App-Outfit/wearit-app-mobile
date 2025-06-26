from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from .explorer_service import ExplorerService

from .pinterest_scraper import PinterestScraper
from typing import List
from .explorer_model import PinterestProduct

pinterest_scraper = PinterestScraper()
router = APIRouter(prefix="/explorer", tags=["Explorer"])


def get_explorer_service():
    return ExplorerService()


@router.get("/search-clothes", response_model=List[PinterestProduct])
async def search_clothes(
    query: str,
    nb_pages: int = 1,
    service: ExplorerService = Depends(get_explorer_service),
):
    """
    Search for clothes on Pinterest.
    """
    return service.search_clothes(query, nb_pages=nb_pages)
