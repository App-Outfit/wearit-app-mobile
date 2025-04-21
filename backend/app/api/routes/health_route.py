from fastapi import APIRouter, HTTPException
from app.infrastructure.database.mongodb import MongoDB
from app.infrastructure.storage.s3_client import S3Client

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
