import pytest
from bson import ObjectId
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

from app.features.user.user_repo import UserRepository
from app.core.errors import NotFoundError
from app.features.user.user_model import UserInDB
from app.features.user.user_schema import UserProfileUpdate


@pytest.fixture
def fake_collection():
    col = MagicMock()
    col.find_one = AsyncMock()
    col.update_one = AsyncMock()
    return col

@pytest.fixture
def user_repo(fake_collection):
    return UserRepository(db={"users": fake_collection})


@pytest.mark.asyncio
async def test_get_user_by_id_found(user_repo, fake_collection):
    user_id = ObjectId()
    doc = {
        "_id": user_id,
        "email": "test@example.com",
        "first_name": "Theo",
        "password": "hashed_pw",
        "credits": 0,
        "referral_code": "ABC123",
        "ref_by": None,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    fake_collection.find_one.return_value = doc

    result = await user_repo.get_user_by_id(str(user_id))
    fake_collection.find_one.assert_called_once_with({"_id": user_id})
    assert isinstance(result, UserInDB)
    assert result.email == "test@example.com"


@pytest.mark.asyncio
async def test_get_user_by_id_not_found(user_repo, fake_collection):
    fake_collection.find_one.return_value = None

    with pytest.raises(NotFoundError, match="User not found"):
        await user_repo.get_user_by_id(str(ObjectId()))


@pytest.mark.asyncio
async def test_update_profile_success(user_repo, fake_collection):
    user_id = ObjectId()

    payload = UserProfileUpdate(first_name="UpdatedName")
    fake_collection.update_one.return_value.matched_count = 1

    # simulate get_user_by_id response after update
    updated_doc = {
        "_id": user_id,
        "email": "test@example.com",
        "first_name": "UpdatedName",
        "password": "hashed_pw",
        "credits": 0,
        "referral_code": "ABC123",
        "ref_by": None,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    fake_collection.find_one.return_value = updated_doc

    result = await user_repo.update_profile(str(user_id), payload)

    fake_collection.update_one.assert_called_once()
    fake_collection.find_one.assert_called()
    assert isinstance(result, UserInDB)
    assert result.first_name == "UpdatedName"


@pytest.mark.asyncio
async def test_update_profile_user_not_found(user_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 0

    with pytest.raises(NotFoundError, match="User not found"):
        await user_repo.update_profile(str(ObjectId()), UserProfileUpdate(first_name="Fail"))
