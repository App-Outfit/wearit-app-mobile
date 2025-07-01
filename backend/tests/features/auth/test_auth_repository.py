# tests/test_auth_repo.py

import pytest
import random
import string
from unittest.mock import MagicMock, AsyncMock
from bson import ObjectId
from datetime import datetime

from app.features.auth.auth_repo import AuthRepository
from app.core.errors import InternalServerError, NotFoundError
from app.features.user.user_model import UserInDB
from unittest.mock import ANY


@pytest.fixture
def fake_collection():
    col = MagicMock()
    col.insert_one = AsyncMock()
    col.find_one = AsyncMock()
    col.update_one = AsyncMock()
    col.delete_one = AsyncMock()
    return col

@pytest.fixture
def auth_repo(fake_collection):
    return AuthRepository(db={"users": fake_collection})

@pytest.fixture(autouse=True)
def patch_random_choices(monkeypatch):
    """
    Pour rendre predictable la génération de referral_code
    """
    seq = ["ABC123", "XYZ789"]
    calls = {"i": 0}

    def fake_choices(options, k):
        code = seq[calls["i"] % len(seq)]
        calls["i"] += 1
        return list(code)

    monkeypatch.setattr(random, "choices", fake_choices)
    return calls


@pytest.mark.asyncio
async def test_create_user_success(auth_repo, fake_collection):
    fake_collection.insert_one.return_value.inserted_id = ObjectId("64a8f0f0f0f0f0f0f0f0f0f0")
    data = {"email": "a@b.com", "password": "pw"}
    user = await auth_repo.create_user(data.copy())

    fake_collection.insert_one.assert_called_once()
    called_args = fake_collection.insert_one.call_args[0][0]
    assert called_args["email"] == "a@b.com"
    assert called_args["password"] == "pw"
    assert "_id" not in data
    assert isinstance(user, UserInDB)
    assert str(user.id) == "64a8f0f0f0f0f0f0f0f0f0f0"


@pytest.mark.asyncio
async def test_get_user_by_email_found(auth_repo, fake_collection):
    doc = {"_id": ObjectId(), "email": "x@y.com", "password": "pw", "credits": 0, "referral_code": "AAA", "ref_by": None, "first_name": "X"}
    fake_collection.find_one.return_value = doc
    res = await auth_repo.get_user_by_email("x@y.com")
    fake_collection.find_one.assert_called_once_with({"email": "x@y.com"})
    assert isinstance(res, UserInDB)
    assert res.email == "x@y.com"


@pytest.mark.asyncio
async def test_get_user_by_email_not_found(auth_repo, fake_collection):
    fake_collection.find_one.return_value = None
    res = await auth_repo.get_user_by_email("z@z.com")
    assert res is None


@pytest.mark.asyncio
async def test_get_user_by_referral_code(auth_repo, fake_collection):
    doc = {"_id": ObjectId(), "email": "u@u.com", "password": "pw", "credits": 0, "referral_code": "CODE", "ref_by": None, "first_name": "U"}
    fake_collection.find_one.return_value = doc
    res = await auth_repo.get_user_by_referral_code("CODE")
    fake_collection.find_one.assert_called_once_with({"referral_code": "CODE"})
    assert res.referral_code == "CODE"


@pytest.mark.asyncio
async def test_generate_unique_referral_code_success(auth_repo, fake_collection):
    # 1ère collision → renvoie un doc, 2ème appel = None
    fake_collection.find_one.side_effect = [{"_id": 1}, None]
    code = await auth_repo.generate_unique_referral_code(length=6)
    # comme fake_choices renvoie "ABC123", puis "XYZ789"
    assert code == "XYZ789"
    assert fake_collection.find_one.call_count == 2


@pytest.mark.asyncio
async def test_generate_unique_referral_code_fail(auth_repo, fake_collection):
    # Toujours collision : on boucle 10 fois puis on échoue
    fake_collection.find_one.side_effect = [{"_id": 1}] * 10
    with pytest.raises(InternalServerError):
        await auth_repo.generate_unique_referral_code()


@pytest.mark.asyncio
async def test_increment_credits_success(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 1
    await auth_repo.increment_credits(ObjectId(), 5)
    fake_collection.update_one.assert_called_once()


@pytest.mark.asyncio
async def test_increment_credits_not_found(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 0
    with pytest.raises(NotFoundError):
        await auth_repo.increment_credits(ObjectId(), 5)


@pytest.mark.asyncio
async def test_delete_user_by_id_success(auth_repo, fake_collection):
    fake_collection.delete_one.return_value.deleted_count = 1
    # ne doit pas lever
    await auth_repo.delete_user_by_id("64a8f0f0f0f0f0f0f0f0f0f0")


@pytest.mark.asyncio
async def test_delete_user_by_id_fail(auth_repo, fake_collection):
    fake_collection.delete_one.return_value.deleted_count = 0
    with pytest.raises(InternalServerError):
        await auth_repo.delete_user_by_id("64a8f0f0f0f0f0f0f0f0f0f0")


@pytest.mark.asyncio
async def test_set_password_reset_code_success(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 1
    await auth_repo.set_password_reset_code("a@b.com", "1234", datetime.now())
    fake_collection.update_one.assert_called_once()


@pytest.mark.asyncio
async def test_set_password_reset_code_not_found(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 0
    with pytest.raises(NotFoundError):
        await auth_repo.set_password_reset_code("a@b.com", "1234", datetime.now())


@pytest.mark.asyncio
async def test_get_password_reset_record_exists(auth_repo, fake_collection):
    fake_collection.find_one.return_value = {"reset_code": "X", "reset_code_expiry": datetime.now()}
    rec = await auth_repo.get_password_reset_record("a@b.com")
    assert rec["reset_code"] == "X"


@pytest.mark.asyncio
async def test_get_password_reset_record_not_exists(auth_repo, fake_collection):
    fake_collection.find_one.return_value = {}
    assert await auth_repo.get_password_reset_record("a@b.com") is None
    fake_collection.find_one.return_value = None
    assert await auth_repo.get_password_reset_record("a@b.com") is None


@pytest.mark.asyncio
async def test_update_password_success(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 1
    await auth_repo.update_password("a@b.com", "newhash")
    fake_collection.update_one.assert_called_once()


@pytest.mark.asyncio
async def test_update_password_not_found(auth_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 0
    with pytest.raises(NotFoundError):
        await auth_repo.update_password("a@b.com", "newhash")
