from fastapi import APIRouter, Depends
from app.core.logging_config import logger
from .user_service import UserService
from .user_repo import UserRepository
from .user_schema import (
    UserProfileResponse, UserProfileUpdate,
    CreditsResponse, ReferralCodeResponse
)
from app.infrastructure.database.dependencies import get_current_user, get_db

router = APIRouter(prefix="/user", tags=["User"])

def get_user_service(db=Depends(get_db)):
    return UserService(UserRepository(db))

# -----------------------
# Profile
# -----------------------

@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(
    current_user = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    logger.info(f"🔵 [API] GET /user/profile — user_id={current_user.id}")
    return await service.get_profile(current_user)

@router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(
    payload: UserProfileUpdate,
    current_user = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    logger.info(f"🟡 [API] PATCH /user/profile — user_id={current_user.id}")
    return await service.update_profile(current_user, payload)

# -----------------------
# Credits
# -----------------------

@router.get("/credits", response_model=CreditsResponse)
async def get_credits(
    current_user = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    logger.info(f"🔵 [API] GET /user/credits — user_id={current_user.id}")
    return await service.get_credits(current_user)

# -----------------------
# Referral
# -----------------------

@router.get("/referral/code", response_model=ReferralCodeResponse)
async def get_referral_code(
    current_user = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    logger.info(f"🔗 [API] GET /user/referral/code — user_id={current_user.id}")
    return await service.get_referral_code(current_user)