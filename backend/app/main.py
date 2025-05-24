# app/main.py
from contextlib import asynccontextmanager

from app.features.auth import auth_route
from app.features.user import user_route
from app.features.body import body_route
from app.features.clothing import clothing_route
from app.features.tryon import tryon_route
from app.features.favorite import favorite_route
# from app.features.payment import payment_route

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.errors import AppError
from app.infrastructure.database.mongodb import MongoDB
from app.infrastructure.storage.s3_client import S3Client

from app.core.exception_handler import global_exception_handler
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

@asynccontextmanager
async def lifespan(app: FastAPI):
    await MongoDB.connect(db_url=settings.MONGODB_URI, db_name=settings.MONGODB_DB)
    await S3Client.connect(
        region=settings.AWS_REGION_NAME,
        bucket_name=settings.AWS_BUCKET_NAME,
        access_key=settings.AWS_ACCESS_KEY_ID,
        secret_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    yield
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, global_exception_handler)
app.add_exception_handler(StarletteHTTPException, global_exception_handler)

# Personnalisation de l’OpenAPI pour BearerAuth…
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

# Vos routers
API_V1 = settings.API_V1_STR
app.include_router(auth_route.router, prefix=API_V1)
app.include_router(user_route.router, prefix=API_V1)
app.include_router(body_route.router, prefix=API_V1)
app.include_router(clothing_route.router, prefix=API_V1)
app.include_router(tryon_route.router, prefix=API_V1)
app.include_router(favorite_route.router, prefix=API_V1)
# app.include_router(payment_route.router, prefix=API_V1)