# app/features/body/body_route.py

from fastapi import APIRouter, Depends, UploadFile, File
from app.infrastructure.database.dependencies import get_current_user, get_db
from .body_service import BodyService
from .body_repo import BodyRepository
from .body_schema import (
    BodyUploadResponse, BodyListResponse, BodyMasksResponse, BodyItem
)

router = APIRouter(prefix="/body", tags=["Body"])

def get_body_service(db=Depends(get_db)):
    return BodyService(BodyRepository(db))

# ✅ POST /body/upload
@router.post("/upload", response_model=BodyUploadResponse)
async def upload_body(
    image: UploadFile = File(...),
    current_user = Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    return await service.upload_body(current_user, image)

# ✅ GET /body/list
@router.get("/list", response_model=BodyListResponse)
async def list_bodies(
    current_user = Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    return await service.get_all_bodies(current_user)

# ✅ GET /body/current
@router.get("/current", response_model=BodyItem)
async def get_current_body(
    current_user = Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    return await service.get_latest_body(current_user)

# ✅ GET /body/{body_id}/masks
@router.get("/{body_id}/masks", response_model=BodyMasksResponse)
async def get_masks(
    body_id: str,
    current_user = Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    return await service.get_masks(body_id, current_user)

# ✅ DELETE /body/{body_id}
@router.delete("/{body_id}")
async def delete_body(
    body_id: str,
    current_user = Depends(get_current_user),
    service: BodyService = Depends(get_body_service)
):
    return await service.delete_body(body_id, current_user)
