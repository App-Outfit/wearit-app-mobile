import pytest
from unittest.mock import MagicMock, AsyncMock
from bson import ObjectId
from datetime import datetime

from app.features.body.body_repo import BodyRepository
from app.core.errors import NotFoundError
from app.features.body.body_model import BodyModel


@pytest.fixture
def fake_body_collection():
    col = MagicMock()
    col.insert_one = AsyncMock()
    col.find_one = AsyncMock()
    col.update_one = AsyncMock()
    col.delete_one = AsyncMock()
    col.find = MagicMock()
    return col


@pytest.fixture
def body_repo(fake_body_collection):
    return BodyRepository(db={"bodies": fake_body_collection})


@pytest.mark.asyncio
async def test_create_body_success(body_repo, fake_body_collection):
    user_id = "645c8a4e8892e9e4c9b12b33"
    body_id = ObjectId()
    image_url = "http://img.com/test.jpg"

    result = await body_repo.create_body(user_id, body_id, image_url)

    fake_body_collection.insert_one.assert_called_once()
    assert isinstance(result, BodyModel)
    assert str(result.user_id) == user_id
    assert result.image_url == image_url
    assert result.status == "pending"


@pytest.mark.asyncio
async def test_set_masks_success(body_repo, fake_body_collection):
    fake_body_collection.update_one.return_value.matched_count = 1
    await body_repo.set_masks("64a8f0f0f0f0f0f0f0f0f0f0", {"mask_upper": "upper"})
    fake_body_collection.update_one.assert_called_once()


@pytest.mark.asyncio
async def test_set_masks_not_found(body_repo, fake_body_collection):
    fake_body_collection.update_one.return_value.matched_count = 0
    with pytest.raises(NotFoundError):
        await body_repo.set_masks("64a8f0f0f0f0f0f0f0f0f0f0", {"mask_upper": "upper"})


@pytest.mark.asyncio
async def test_get_all_bodies_success(body_repo, fake_body_collection):
    fake_cursor = AsyncMock()
    fake_cursor.to_list.return_value = [{
        "_id": ObjectId(),
        "user_id": ObjectId(),
        "image_url": "url",
        "mask_upper": None,
        "mask_lower": None,
        "mask_dress": None,
        "is_default": False,
        "status": "ready",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }]
    fake_body_collection.find.return_value.sort.return_value = fake_cursor

    results = await body_repo.get_all_bodies("645c8a4e8892e9e4c9b12b33")
    assert isinstance(results, list)
    assert isinstance(results[0], BodyModel)


@pytest.mark.asyncio
async def test_get_latest_body_found(body_repo, fake_body_collection):
    fake_body_collection.find_one.return_value = {
        "_id": ObjectId(),
        "user_id": ObjectId(),
        "image_url": "img.jpg",
        "mask_upper": None,
        "mask_lower": None,
        "mask_dress": None,
        "is_default": False,
        "status": "ready",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    result = await body_repo.get_latest_body("645c8a4e8892e9e4c9b12b33")
    assert isinstance(result, BodyModel)


@pytest.mark.asyncio
async def test_get_latest_body_none(body_repo, fake_body_collection):
    fake_body_collection.find_one.return_value = None
    result = await body_repo.get_latest_body("645c8a4e8892e9e4c9b12b33")
    assert result is None


@pytest.mark.asyncio
async def test_get_body_by_id_success(body_repo, fake_body_collection):
    fake_body_collection.find_one.return_value = {
        "_id": ObjectId(),
        "user_id": ObjectId(),
        "image_url": "url",
        "mask_upper": None,
        "mask_lower": None,
        "mask_dress": None,
        "is_default": False,
        "status": "ready",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    result = await body_repo.get_body_by_id("64a8f0f0f0f0f0f0f0f0f0f0")
    assert isinstance(result, BodyModel)


@pytest.mark.asyncio
async def test_get_body_by_id_not_found(body_repo, fake_body_collection):
    fake_body_collection.find_one.return_value = None
    with pytest.raises(NotFoundError):
        await body_repo.get_body_by_id("64a8f0f0f0f0f0f0f0f0f0f0")


@pytest.mark.asyncio
async def test_delete_body_success(body_repo, fake_body_collection):
    fake_body_collection.delete_one.return_value.deleted_count = 1
    await body_repo.delete_body("64a8f0f0f0f0f0f0f0f0f0f0")


@pytest.mark.asyncio
async def test_delete_body_not_found(body_repo, fake_body_collection):
    fake_body_collection.delete_one.return_value.deleted_count = 0
    with pytest.raises(NotFoundError):
        await body_repo.delete_body("64a8f0f0f0f0f0f0f0f0f0f0")