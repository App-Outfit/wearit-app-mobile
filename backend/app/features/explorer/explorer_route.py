from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from .query_transformer import transform_as_clothe_query
from .pinterest_scraper import PinterestScraper
pinterest_scraper = PinterestScraper()
router = APIRouter(prefix="/explorer", tags=["Explorer"])

router.get('/search-clothes')
async def search_clothes(query: str, nb_pages: int = 1):
    query = transform_as_clothe_query(query)
    products = pinterest_scraper.get_products(query=query, nb_pages=nb_pages, is_buyable=True)

    return products