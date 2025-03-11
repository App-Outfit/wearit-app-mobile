from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.postgres import get_db
from app.services.body_service import BodyService
from app.repositories.body_repo import BodyRepository
from app.api.schemas.body_schema import BodyCreate, BodyCreateResponse, BodyResponse, BodyListResponse, BodyDeleteResponse
from fastapi import Form, UploadFile, File

router = APIRouter(prefix="/body", tags=["Body"])

def get_body_service(db: AsyncSession = Depends(get_db)):
    return BodyService(repository=BodyRepository(db))

# POST a new body
@router.post("/", response_model=BodyCreateResponse)
async def create_body(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received POST request to create a new body")
    body_data = BodyCreate(
        user_id=user_id,
        file=file
    )
    return await service.create_body(body_data)

# GET a body by its ID
@router.get("/{body_id}", response_model=BodyResponse)
async def get_body(body_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received GET request for body_id: {body_id}")
    return await service.get_body_by_id(body_id)

# GET a list of all bodies by user_id
@router.get("/bodies/{user_id}", response_model=BodyListResponse)
async def get_bodies(user_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received GET request for user_id: {user_id}")
    return await service.get_bodies(user_id)

# DELETE a body by its ID
@router.delete("/{body_id}", response_model=BodyDeleteResponse)
async def delete_body(body_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received DELETE request for body_id: {body_id}")
    return await service.delete_body(body_id)