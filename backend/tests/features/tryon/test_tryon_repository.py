import pytest
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId
from datetime import datetime

from app.features.tryon.tryon_repo import TryonRepository
from app.core.errors import NotFoundError
from app.features.tryon.tryon_model import TryonModel

@pytest.fixture
def fake_collection():
    col = MagicMock()
    col.insert_one = AsyncMock()
    col.update_one = AsyncMock()
    col.find_one = AsyncMock()
    col.find = MagicMock()
    col.delete_one = AsyncMock()
    col.find.return_value.to_list = AsyncMock()
    return col

@pytest.fixture
def tryon_repo(fake_collection):
    return TryonRepository(db={"tryons": fake_collection})

@pytest.mark.asyncio
async def test_create_tryon(tryon_repo, fake_collection):
    fake_collection.insert_one.return_value = None
    tryon_id = ObjectId()
    user_id = ObjectId()
    body_id = ObjectId()
    clothing_id = ObjectId()
    created_at = datetime.now()
    tryon = await tryon_repo.create_tryon(
        tryon_id, str(user_id), str(body_id), str(clothing_id), 1, created_at
    )
    fake_collection.insert_one.assert_called_once()
    assert isinstance(tryon, TryonModel)
    assert tryon.version == 1

@pytest.mark.asyncio
async def test_set_tryon_success(tryon_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 1
    await tryon_repo.set_tryon("64a8f0f0f0f0f0f0f0f0f0f0", "s3_key.png")
    fake_collection.update_one.assert_called_once()

@pytest.mark.asyncio
async def test_set_tryon_not_found(tryon_repo, fake_collection):
    fake_collection.update_one.return_value.matched_count = 0
    with pytest.raises(NotFoundError):
        await tryon_repo.set_tryon("64a8f0f0f0f0f0f0f0f0f0f0", "s3_key.png")

@pytest.mark.asyncio
async def test_get_all_by_user(tryon_repo, fake_collection):
    fake_collection.find.return_value.to_list.return_value = [
        {"_id": ObjectId(), "user_id": ObjectId(), "body_id": ObjectId(), "clothing_id": ObjectId(),
            "version": 1, "status": "ready", "created_at": datetime.now(), "updated_at": datetime.now()}
    ]
    result = await tryon_repo.get_all_by_user(str(ObjectId()))
    assert len(result) == 1
    assert isinstance(result[0], TryonModel)

@pytest.mark.asyncio
async def test_get_all_by_body_and_clothing(tryon_repo, fake_collection):
    fake_collection.find.return_value.sort.return_value.to_list.return_value = [
        {"_id": ObjectId(), "user_id": ObjectId(), "body_id": ObjectId(), "clothing_id": ObjectId(),
            "version": 1, "status": "ready", "created_at": datetime.now(), "updated_at": datetime.now()}
    ]
    result = await tryon_repo.get_all_by_body_and_clothing(str(ObjectId()), str(ObjectId()))
    assert len(result) == 1
    assert isinstance(result[0], TryonModel)

@pytest.mark.asyncio
async def test_get_tryon_by_id_found(tryon_repo, fake_collection):
    fake_collection.find_one.return_value = {
        "_id": ObjectId(), "user_id": ObjectId(), "body_id": ObjectId(), "clothing_id": ObjectId(),
        "version": 1, "status": "ready", "created_at": datetime.now(), "updated_at": datetime.now()
    }
    tryon = await tryon_repo.get_tryon_by_id(str(ObjectId()))
    assert isinstance(tryon, TryonModel)

@pytest.mark.asyncio
async def test_get_tryon_by_id_not_found(tryon_repo, fake_collection):
    fake_collection.find_one.return_value = None
    tryon = await tryon_repo.get_tryon_by_id(str(ObjectId()))
    assert tryon is None

@pytest.mark.asyncio
async def test_delete_tryon_success(tryon_repo, fake_collection):
    fake_collection.delete_one.return_value.deleted_count = 1
    await tryon_repo.delete_tryon(str(ObjectId()))
    fake_collection.delete_one.assert_called_once()

@pytest.mark.asyncio
async def test_delete_tryon_not_found(tryon_repo, fake_collection):
    fake_collection.delete_one.return_value.deleted_count = 0
    with pytest.raises(NotFoundError):
        await tryon_repo.delete_tryon(str(ObjectId()))