import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId

from app.features.user.user_service import UserService
from app.features.user.user_model import UserInDB
from app.features.user.user_schema import UserProfileUpdate
from app.core.errors import NotFoundError


@pytest.fixture
def fake_user():
    user = MagicMock()
    user.id = str(ObjectId())
    return user


@pytest.fixture
def user_data(fake_user):
    return UserInDB(
        id=ObjectId(fake_user.id),
        email="user@example.com",
        first_name="Theo",
        last_name="Lemoine",
        password="pw",
        gender="male",
        credits=42,
        referral_code="XYZ123",
        ref_by=None,
        answers={"q1": "A", "q2": "B"},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )


@pytest.fixture
def fake_repo(user_data):
    repo = MagicMock()
    repo.get_user_by_id = AsyncMock(return_value=user_data)
    repo.update_profile = AsyncMock(return_value=user_data)
    return repo


@pytest.fixture
def user_service(fake_repo):
    return UserService(repo=fake_repo)


# -----------------------
# get_profile
# -----------------------

@pytest.mark.asyncio
async def test_get_profile_success(user_service, fake_user, fake_repo, user_data):
    profile = await user_service.get_profile(fake_user)
    fake_repo.get_user_by_id.assert_called_once_with(ObjectId(fake_user.id))
    assert profile.user_id == str(user_data.id)
    assert profile.first_name == user_data.first_name


@pytest.mark.asyncio
async def test_get_profile_user_not_found(user_service, fake_user, fake_repo):
    fake_repo.get_user_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await user_service.get_profile(fake_user)


# -----------------------
# update_profile
# -----------------------

@pytest.mark.asyncio
async def test_update_profile_success(user_service, fake_user, fake_repo, user_data):
    payload = UserProfileUpdate(first_name="NewName")
    updated = await user_service.update_profile(fake_user, payload)

    fake_repo.update_profile.assert_called_once_with(ObjectId(fake_user.id), payload)
    assert updated.user_id == str(user_data.id)
    assert updated.first_name == user_data.first_name


# -----------------------
# get_credits
# -----------------------

@pytest.mark.asyncio
async def test_get_credits_success(user_service, fake_user, user_data):
    credits = await user_service.get_credits(fake_user)
    assert credits.user_id == str(user_data.id)
    assert credits.credits == user_data.credits
    assert credits.updated_at == user_data.updated_at


# -----------------------
# get_referral_code
# -----------------------

@pytest.mark.asyncio
async def test_get_referral_code_success(user_service, fake_user, user_data):
    result = await user_service.get_referral_code(fake_user)
    assert result.referral_code == user_data.referral_code
