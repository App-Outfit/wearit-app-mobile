from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi

from app.core.config import settings       # votre Pydantic Settings
from app.core.errors import AppError       # base de toutes vos erreurs métiers
from app.infrastructure.database.mongodb import MongoDB
from app.infrastructure.storage.s3_client import S3Client
from app.api.routes import (
    auth_route,
    body_route,
    wardrobe_route,
    tryon_route,
    health_route,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Démarrage
    await MongoDB.connect(
        db_url=settings.MONGODB_URI,
        db_name=settings.MONGODB_DB,
    )
    await S3Client.connect(
        region=settings.AWS_REGION_NAME,
        bucket_name=settings.AWS_BUCKET_NAME,
        access_key=settings.AWS_ACCESS_KEY_ID,
        secret_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    yield
    # Arrêt
    await MongoDB.close()
    await S3Client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.PROJECT_DESCRIPTION,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
)

# OAuth2 pour Swagger/OpenAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


# Exception handler global pour vos AppError
@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.error_code, "message": exc.message},
    )


# Personnalisation de l’OpenAPI avec BearerAuth
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in schema["paths"].values():
        for op in path.values():
            op.setdefault("security", []).append({"BearerAuth": []})
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclusion des routers avec prefix versionné
API_V1 = settings.API_V1_STR     # ex. "/api/v1"
app.include_router(auth_route.router, prefix=API_V1, tags=["Auth"])
app.include_router(body_route.router, prefix=API_V1, tags=["Body"])
app.include_router(wardrobe_route.router, prefix=API_V1, tags=["Wardrobe"])
app.include_router(tryon_route.router, prefix=API_V1, tags=["Try‑On"])
app.include_router(health_route.router, prefix=API_V1, tags=["Health"])
