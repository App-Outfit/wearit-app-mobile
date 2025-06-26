from .pinterest_scraper import PinterestScraper
from .explorer_model import ProductsPage
from .explorer_schema import SearchClothingPayload
from sentence_transformers import SentenceTransformer, util
import time
from typing import List

# Concepts mode génériques
fashion_concepts = [
    "clothing",
    "outfit",
    "apparel",
    "clothing style",
    "fashion",
    "t-shirt",
    "dress",
    "hoodie",
    "model outfit",
    "runway look",
    "tshirt",
    "hoodie outfit",
    "pants",
]


class ExplorerService:
    def __init__(self) -> None:
        self.pinterest_scraper = PinterestScraper()
        self.model = SentenceTransformer("paraphrase-MiniLM-L6-v2")
        self.fashion_embeddings = self.model.encode(fashion_concepts)

    def search_clothes(self, payload: SearchClothingPayload) -> List[ProductsPage]:
        query = payload.query
        bookmark = payload.bookmark
        csrf_token = payload.csrf_token
        query = self.transform_as_clothe_query(query)
        products_page = self.pinterest_scraper.get_page(
            query=query, bookmark=bookmark, csrf_token=csrf_token,is_buyable=True
        )
        return products_page

    # Embeddings de référence

    def best_fashion_score(self, query: str) -> float:

        query_embedding = self.model.encode([query])
        scores = util.cos_sim(query_embedding, self.fashion_embeddings)
        max_score = scores.max().item()
        return max_score

    def transform_as_clothe_query(self, query: str) -> str:
        start_time = time.time()
        score = self.best_fashion_score(query)
        begin_time = time.time() - start_time
        if score < 0.5:
            return "outfit" + " " + query
        else:
            return query
