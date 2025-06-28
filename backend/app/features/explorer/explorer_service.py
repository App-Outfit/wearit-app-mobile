# src/features/explorer/explorer_service.py

import asyncio
from .pinterest_scraper import PinterestScraper
from .explorer_schema import SearchClothingPayload
from .explorer_model import ProductsPage
from sentence_transformers import SentenceTransformer, util

fashion_concepts = [
    "clothing", "outfit", "apparel", "clothing style",
    "fashion", "t-shirt", "dress", "hoodie",
    "model outfit", "runway look", "tshirt",
    "hoodie outfit", "pants",
]

class ExplorerService:
    def __init__(self) -> None:
        self.pinterest_scraper = PinterestScraper()
        self.model = SentenceTransformer("paraphrase-MiniLM-L6-v2")
        # Pré‐encoder les concepts pour le scoring
        self.fashion_embeddings = self.model.encode(fashion_concepts)

    def _sync_search(self, payload: SearchClothingPayload) -> ProductsPage:
        """Version synchrone du workflow de recherche."""
        # 1️⃣ Transformation de la query
        query = self.transform_as_clothe_query(payload.query, payload.gender)
        print(f"[sync] Transformed query: {query}")

        # 2️⃣ Appel bloquant au scraper
        page: ProductsPage = self.pinterest_scraper.get_page(
            query=query,
            bookmark=payload.bookmark,
            csrf_token=payload.csrf_token,
            is_buyable=True,
        )
        # print(f"[sync] Products page: {page}")
        page["query"] = query
        return page

    async def search_clothes(self, payload: SearchClothingPayload) -> ProductsPage:
        """
        Service asynchrone : délègue tout le travail intensif
        dans un thread pour ne pas bloquer l’event loop.
        """
        # asyncio.to_thread est disponible dans Python 3.9+
        return await asyncio.to_thread(self._sync_search, payload)

    def best_fashion_score(self, query: str) -> float:
        """Calcule la similarité entre la query et nos concepts."""
        query_emb = self.model.encode([query])
        scores = util.cos_sim(query_emb, self.fashion_embeddings)
        return float(scores.max().item())

    def transform_as_clothe_query(self, query: str, gender: str | None = None) -> str:
        """Pré‐fixe 'outfit' si la query semble hors‐sujet fashion."""
        score = self.best_fashion_score(query)
        if score < 0.5:
            query = "outfit " + query
        if gender:
            query = f"{query} {gender}"
        return query.strip()

