# src/features/explorer/explorer_router.py

from fastapi import APIRouter, Depends
from .explorer_service import ExplorerService
from .explorer_schema import SearchClothingPayload
from .explorer_model import ProductsPage

router = APIRouter(prefix="/explorer", tags=["Explorer"])

def get_explorer_service() -> ExplorerService:
    return ExplorerService()

@router.post(
    "/search-clothes",
    response_model=ProductsPage,
    summary="Search for clothes on Pinterest (async)",
)
async def search_clothes(
    payload: SearchClothingPayload,
    service: ExplorerService = Depends(get_explorer_service),
) -> ProductsPage:
    """
    Recherche de vêtements sur Pinterest, non‐bloquant.
    """
    # On await bien la version async
    result = await service.search_clothes(payload)
    print(f"Result keys : {list(result.keys())}")
    return result
