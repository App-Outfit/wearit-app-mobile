import pytest
from unittest.mock import AsyncMock, MagicMock
from pymongo.errors import PyMongoError

from app.repositories.auth_repo import AuthRepository, UserInDB
from app.core.errors import InternalServerError

@pytest.mark.asyncio
async def test_get_user_by_email_not_found():
    fake_db = {"users": MagicMock()}
    fake_db["users"].find_one = AsyncMock(return_value=None)
    repo = AuthRepository(db=fake_db)
    assert await repo.get_user_by_email("no@one.com") is None

@pytest.mark.asyncio
async def test_get_user_by_email_db_error():
    fake_db = {"users": MagicMock()}
    fake_db["users"].find_one = AsyncMock(side_effect=PyMongoError("fail"))
    repo = AuthRepository(db=fake_db)
    with pytest.raises(InternalServerError):
        await repo.get_user_by_email("err@db.com")

@pytest.mark.asyncio
async def test_create_user_success():
    fake_col = MagicMock()
    fake_col.insert_one = AsyncMock(return_value=MagicMock(inserted_id="abc"))
    fake_db = {"users": fake_col}
    repo = AuthRepository(db=fake_db)

    user = await repo.create_user("x@y.com", "h", "Name")
    assert user.id == "abc"
    assert user.email == "x@y.com"

@pytest.mark.asyncio
async def test_create_user_db_error():
    fake_col = MagicMock()
    fake_col.insert_one = AsyncMock(side_effect=PyMongoError("fail"))
    fake_db = {"users": fake_col}
    repo = AuthRepository(db=fake_db)
    with pytest.raises(InternalServerError):
        await repo.create_user("x@y.com", "h", "Name")

@pytest.mark.asyncio
async def test_delete_user_by_id_success():
    fake_col = MagicMock()
    fake_col.delete_one = AsyncMock(return_value=MagicMock(deleted_count=1))
    fake_db = {"users": fake_col}
    repo = AuthRepository(db=fake_db)
    # ne doit pas lever
    await repo.delete_user_by_id("60f5c2e5a3d4b5c6d7e8f9a0")

@pytest.mark.asyncio
async def test_delete_user_by_id_not_deleted():
    fake_col = MagicMock()
    fake_col.delete_one = AsyncMock(return_value=MagicMock(deleted_count=0))
    fake_db = {"users": fake_col}
    repo = AuthRepository(db=fake_db)
    with pytest.raises(InternalServerError):
        await repo.delete_user_by_id("60f5c2e5a3d4b5c6d7e8f9a0")

@pytest.mark.asyncio
async def test_delete_user_by_id_db_error():
    fake_col = MagicMock()
    fake_col.delete_one = AsyncMock(side_effect=PyMongoError("fail"))
    fake_db = {"users": fake_col}
    repo = AuthRepository(db=fake_db)
    with pytest.raises(InternalServerError):
        await repo.delete_user_by_id("60f5c2e5a3d4b5c6d7e8f9a0")
