from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import wardrobe  # Import des routes
from app.infrastructure.database.mongodb import MongoDB

app = FastAPI()

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "wearit-test"

# 📌 Initialisation de l'application FastAPI
app = FastAPI(
    title="WearIT API",
    description="Backend for virtual try-on application",
    version="1.0.0",
)

# 📌 Configuration CORS (si le frontend est sur un autre domaine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autoriser tous les domaines (à restreindre en prod)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, DELETE...
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """ Connexion à MongoDB au démarrage """
    await MongoDB.connect(MONGO_URL, DB_NAME)

@app.on_event("shutdown")
async def shutdown_event():
    """ Fermeture propre de MongoDB """
    await MongoDB.close()

# 📌 Inclure les routes
app.include_router(wardrobe.router)

# 📌 Point de départ si lancé directement
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
