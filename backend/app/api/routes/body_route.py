from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from app.services.body_service import BodyService
from app.repositories.body_repo import BodyRepository
from app.api.schemas.body_schema import BodyCreateResponse, BodyResponse, BodyListResponse, BodyDeleteResponse
from fastapi import Form, UploadFile, File

router = APIRouter(prefix="/body", tags=["Body"])

from fastapi import Depends

def get_body_service(repo: BodyRepository = Depends()):
    return BodyService(repo)

# POST a new body
@router.post("/", response_model=BodyCreateResponse)
async def create_body(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received POST request to create a new body")
    body_data = {
        "user_id": user_id,
        "file": file
    }
    return await service.create_body(body_data)

# GET a body by its ID
@router.get("/{body_id}", response_model=BodyResponse)
async def get_body(body_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received GET request for body_id: {body_id}")
    return await service.get_body_by_id(body_id)

# DELETE a body by its ID
@router.delete("/{body_id}", response_model=BodyDeleteResponse)
async def delete_body(body_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received DELETE request for body_id: {body_id}")
    return await service.delete_body(body_id)

# GET a list of all bodies by user_id
@router.get("/list/{user_id}", response_model=BodyListResponse)
async def get_bodies(user_id: str, service: BodyService = Depends(get_body_service)):
    logger.info(f"🔵 [API] Received GET request for user_id: {user_id}")
    return await service.get_bodies(user_id)