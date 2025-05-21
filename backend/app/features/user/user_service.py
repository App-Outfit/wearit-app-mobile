from .user_repo import UserRepository
from .user_schema import (
    UserProfileResponse,
    UserProfileUpdate,
    CreditsResponse,
    ReferralCodeResponse,
)
from app.core.errors import NotFoundError
from app.core.logging_config import logger
from bson import ObjectId


class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    # -----------------------
    # Profile
    # -----------------------

    async def get_profile(self, user) -> UserProfileResponse:
        doc = await self.repo.get_user_by_id(ObjectId(user.id))
        if not doc:
            logger.warning(f"❌ User not found: {user.id}")
            raise NotFoundError("User not found")
        return UserProfileResponse(
            user_id=str(doc.id),
            first_name=doc.first_name,
            last_name=doc.last_name,
            gender=doc.gender,
            credits=doc.credits,
            referral_code=doc.referral_code,
            answers=doc.answers,
        )

    async def update_profile(self, user, payload: UserProfileUpdate) -> UserProfileResponse:
        updated = await self.repo.update_profile(ObjectId(user.id), payload)
        return UserProfileResponse(
            user_id=str(updated.id),
            first_name=updated.first_name,
            last_name=updated.last_name,
            gender=updated.gender,
            credits=updated.credits,
            referral_code=updated.referral_code,
            answers=updated.answers,
        )

    # -----------------------
    # Credits
    # -----------------------

    async def get_credits(self, user) -> CreditsResponse:
        doc = await self.repo.get_user_by_id(ObjectId(user.id))
        return CreditsResponse(
            user_id=str(doc.id),
            credits=doc.credits,
            updated_at=doc.updated_at
        )

    # -----------------------
    # Referral
    # -----------------------

    async def get_referral_code(self, user) -> ReferralCodeResponse:
        doc = await self.repo.get_user_by_id(ObjectId(user.id))
        return ReferralCodeResponse(referral_code=doc.referral_code)
