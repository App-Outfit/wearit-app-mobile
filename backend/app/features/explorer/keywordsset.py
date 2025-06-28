import itertools
from typing import List

from .explorer_model import KeywordsClothingQuery


class KeyWordsSet:
    clothing_types = []
    colors = []
    genders = []
    size_adjectives = []
    color_adjectives = []
    language = "en"

    def generate_combinations(self) -> KeywordsClothingQuery:
        clothing_queries: List[KeywordsClothingQuery] = [
            KeywordsClothingQuery(
                clothing_type=ctype,
                color=color,
                gender=gender,
                size_adjective=size,
                color_adjective=color_adj,
            )
            for ctype, color, gender, size, color_adj in itertools.product(
                self.clothing_types,
                self.colors,
                self.genders,
                self.size_adjectives,
                self.color_adjectives,
            )
        ]
        return clothing_queries


class FrenchKeyWordsSet(KeyWordsSet):
    clothing_types = [
        "t-shirt",
        "jeans",
        "robe",
        "jupe",
        "shorts",
        "veste",
        "manteau",
        "hoodie",
        "pull",
        "blouse",
        "chemise",
        "gilet",
        "legging",
        "pantalon",
        "costume",
        "blazer",
        "pantalons",
    ]
    colors = [
        "blanc",
        "noir",
        "rouge",
        "orange",
        "jaune",
        "vert",
        "bleu",
        "violet",
        "ivoire",
        "crème",
        "beige",
        "rose",
        "kaki",
        "brun",
        "marron",
        "bordeaux",
    ]
    color_adjectives = [
        "clair",
        "foncé",
    ]
    genders = ["femme", "homme"]
    size_adjectives = ["oversize", "grand"]


class EnglishStyleWordsSet:
    style_words = [
        "casual",
        "sporty",
        "chic",
        "elegant",
        "bohemian",
        "streetwear",
        "vintage",
        "modern",
        "classic",
        "trendy",
        "sophisticated",
        "minimalist",
        "edgy",
        "romantic",
        "80s",
        "90s",
        "futuristic",
        "retro",
        "gothic",
        "punk",
        "preppy",
        "grunge",
        "artsy",
        "business casual",
        "athleisure",
        "formal",
        "laid-back",
        "urban",
    ]

    def generate_style_combinations(self) -> List[str]:
        return self.style_words


class EnglishKeyWordsSet(KeyWordsSet):
    clothing_types = [
        "t-shirt",
        "jeans",
        "dress",
        "legging",
        "skirt",
        "shorts",
        "jacket",
        "coat",
        "hoodie",
        "sweater",
        "blouse",
        "shirt",
        "pants",
        "suit",
        "blazer",
        "trousers",
    ]
    colors = [
        "red",
        "blue",
        "green",
        "black",
        "white",
        "yellow",
        "pink",
        "purple",
        "orange",
        "brown",
    ]
    color_adjectives = [
        "light",
        "dark",
        "bright",
        "pale",
        "deep",
        "vibrant",
        "muted",
        "pastel",
    ]
    genders = ["women", "men"]
    size_adjectives = ["small", "oversize", "large", "extra-large"]