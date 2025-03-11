from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.models import APIKey, SecurityScheme
from fastapi.openapi.utils import get_openapi
import os

from app.infrastructure.database.postgres import postgres_db
from app.infrastructure.storage.s3_client import S3Client
from app.api.routes import wardrobe_route, body_route, auth_route
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="WearIT API",
    description="Backend for virtual try-on application",
    version="1.0.0",
)

# 📌 Configuration OAuth2 pour Swagger
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="WearIT API",
        version="1.0.0",
        description="Backend for virtual try-on application",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return openapi_schema

app.openapi = custom_openapi

# 📌 Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Événements de démarrage et arrêt
@app.on_event("startup")
async def startup_event():
    await postgres_db.connect()
    await S3Client.connect(os.getenv("AWS_REGION_NAME"), os.getenv("AWS_BUCKET_NAME"),
                           os.getenv("AWS_ACCESS_KEY_ID"), os.getenv("AWS_SECRET_ACCESS_KEY"))

@app.on_event("shutdown")
async def shutdown_event():
    await postgres_db.close()
    await S3Client.close()

# 📌 Inclusion des routes
app.include_router(auth_route.router)
app.include_router(wardrobe_route.router)
app.include_router(body_route.router)