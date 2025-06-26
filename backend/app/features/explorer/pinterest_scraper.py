import json
import random
from typing import List, Union
from urllib.parse import quote

import requests
from requests import Session

from .constants import (
    BASE_OPTIONS,
    PINTEREST_BASE_HEADERS,
)

from .explorer_model import (
    PinterestProduct,
    ProductsPage,
)


class PinterestScraper:
    def __init__(self):
        self.base_options = BASE_OPTIONS.copy()
        self.base_headers = PINTEREST_BASE_HEADERS.copy()
        self.get_url = "https://fr.pinterest.com/resource/BaseSearchResource/get"

    def _filter_results(self, data: dict, query: str = None) -> List[dict]:
        """Nettoie les résultats Pinterest en extrayant uniquement les informations nécessaires."""
        results = data.get("resource_response", {}).get("data", {}).get("results", [])
        clean_data = []

        for result in results:
            product_data = {
                "product_url": result.get("link"),
                "description": (
                    result.get("description", "")
                    or result.get("seo_alt_text", "")
                    or result.get("rich_metadata", {}).get("description", "")
                ).strip(),
                "image_url": result.get("images", {}).get("orig", {}).get("url", ""),
                "pinterest_url": f"https://www.pinterest.com/pin/{result.get('id')}/",
            }
            if query:
                product_data["query"] = query
            clean_data.append(product_data)

        return clean_data

    def _get_csrf_token(self) -> str:
        """Récupère le token CSRF depuis Pinterest."""
        response = requests.get("https://fr.pinterest.com/")
        response.raise_for_status()
        token = response.cookies.get("csrftoken")
        if not token:
            raise ValueError("CSRF token not found in cookies.")
        return token

    def get_products(
        self, query: str, is_buyable: bool = False, nb_pages: int = 1
    ) -> List[dict]:
        products: List[PinterestProduct] = []
        try:
            page_data = self.get_page(query=query, is_buyable=is_buyable)
            page = ProductsPage.model_validate(page_data)
        except Exception as e:
            print(f"Error on query '{query}': {e}")
            return []

        if not page.products:
            print(f"No products for query: {query}")
            return []

        for product in page.products:
            products.append(PinterestProduct.model_validate(product))

        for _ in range(1, nb_pages):
            try:
                page_data = self.get_page(
                    query=query,
                    bookmark=page.bookmark,
                    csrf_token=page.csrf_token,
                    is_buyable=is_buyable,
                )
                page = ProductsPage.model_validate(page_data)
            except Exception as e:
                print(f"Pagination error on query '{query}': {e}")
                break

            for product in page.products:
                products.append(PinterestProduct.model_validate(product))

        return [p.model_dump() for p in products]

    def get_page(
        self,
        query: str,
        bookmark: str = None,
        csrf_token: str = None,
        is_buyable: bool = False,
    ) -> Union[ProductsPage, dict]:
        """Récupère une page de résultats Pinterest pour une requête donnée."""
        session = Session()
        csrf_token = csrf_token or self._get_csrf_token()
        query_url_encoded = quote(query, safe="")
        source_url = (
            f"/search/{'buyable_pins' if is_buyable else 'pins'}/?q={query_url_encoded}"
        )

        options = self.base_options.copy()
        options["options"].update({"query": query, "source_url": source_url})
        if is_buyable:
            options["options"]["scope"] = "buyable_pins"
        if bookmark:
            options["options"]["bookmarks"] = [bookmark]

        method = session.post if bookmark else session.get
        request_kwargs = {
            "headers": {**self.base_headers, "X-CSRFToken": csrf_token},
            "cookies": {"csrftoken": csrf_token},
            "timeout": 5,
        }

        if bookmark:
            request_kwargs["data"] = {
                "source_url": query_url_encoded,
                "data": json.dumps(options, ensure_ascii=False),
            }
        else:
            request_kwargs["params"] = {
                "source_url": source_url,
                "data": json.dumps(options),
            }

        response = method(self.get_url, **request_kwargs)
        response.raise_for_status()

        try:
            data = response.json()
            clean_data = self._filter_results(data, query=query)
            return {
                "products": clean_data,
                "bookmark": data.get("resource_response", {}).get("bookmark"),
                "csrf_token": csrf_token,
            }
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to decode JSON for query '{query}': {e}") from e
