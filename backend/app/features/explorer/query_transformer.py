from sentence_transformers import SentenceTransformer, util
import time
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

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

# Embeddings de référence
fashion_embeddings = model.encode(fashion_concepts)


def best_fashion_score(query):
    query_embedding = model.encode([query])
    scores = util.cos_sim(query_embedding, fashion_embeddings)
    # afficher le concept le plus proche
    closest_index = scores.argmax().item()
    closest_concept = fashion_concepts[closest_index]
    print(f"Closest fashion concept for '{query}': {closest_concept}")
    max_score = scores.max().item()
    return max_score


def transform_as_clothe_query(query):
    start_time = time.time()
    score = best_fashion_score(query)
    begin_time = time.time() - start_time
    print(f"Time taken to compute score: {begin_time:.2f} seconds")
    print(f"Score for query '{query}': {score}")
    if score < 0.5:
        return "outfit" + " " + query
    else:
        return query