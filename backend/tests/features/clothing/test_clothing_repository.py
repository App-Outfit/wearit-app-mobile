import pytest
from unittest.mock import MagicMock, AsyncMock
from bson import ObjectId
from datetime import datetime

from app.features.clothing.clothing_repo import ClothingRepository
from app.features.clothing.clothing_model import ClothingModel
from app.features.clothing.clothing_schema import ClothingUpdate
from app.core.errors import InternalServerError

@pytest.fixture
def fake_collection():
    col = MagicMock()
    col.insert_one = AsyncMock()
    col.find = MagicMock()
    col.find_one = AsyncMock()
    col.delete_one = AsyncMock()
    col.find_one_and_update = AsyncMock()
    col.distinct = AsyncMock()
    return col

@pytest.fixture
def clothing_repo(fake_collection):
    return ClothingRepository(db={"clothing": fake_collection})

@pytest.mark.asyncio
async def test_create_clothing_success(clothing_repo, fake_collection):
    user_id = "64a8f0f0f0f0f0f0f0f0f0f0"
    clothing_id = "64a8f0f0f0f0f0f0f0f0f0f1"
    now = datetime.now()
    fake_collection.insert_one.return_value.inserted_id = ObjectId(clothing_id)
    res = await clothing_repo.create_clothing(user_id, clothing_id, "url", "top", "shirt", now)
    fake_collection.insert_one.assert_called_once()
    assert isinstance(res, ClothingModel)
    assert res.category == "top"

@pytest.mark.asyncio
async def test_get_clothes_with_and_without_category(clothing_repo, fake_collection):
    doc = {"_id": ObjectId(), "user_id": ObjectId(), "image_url": "url", "category": "top", "name": "shirt", "created_at": datetime.now(), "updated_at": datetime.now()}
    fake_collection.find.return_value.to_list = AsyncMock(return_value=[doc])
    res = await clothing_repo.get_clothes(str(doc["user_id"]))
    assert isinstance(res[0], ClothingModel)
    res_cat = await clothing_repo.get_clothes(str(doc["user_id"]), category="top")
    assert isinstance(res_cat[0], ClothingModel)

@pytest.mark.asyncio
async def test_get_clothing_by_id(clothing_repo, fake_collection):
    doc = {"_id": ObjectId(), "user_id": ObjectId(), "image_url": "url", "category": "top", "name": "shirt", "created_at": datetime.now(), "updated_at": datetime.now()}
    fake_collection.find_one.return_value = doc
    res = await clothing_repo.get_clothing_by_id(str(doc["_id"]))
    assert isinstance(res, ClothingModel)
    fake_collection.find_one.return_value = None
    assert await clothing_repo.get_clothing_by_id(str(doc["_id"])) is None

@pytest.mark.asyncio
async def test_delete_clothing(clothing_repo, fake_collection):
    fake_collection.delete_one.return_value.deleted_count = 1
    assert await clothing_repo.delete_clothing("64a8f0f0f0f0f0f0f0f0f0f0")
    fake_collection.delete_one.return_value.deleted_count = 0
    assert not await clothing_repo.delete_clothing("64a8f0f0f0f0f0f0f0f0f0f0")

@pytest.mark.asyncio
async def test_update_clothing_success(clothing_repo, fake_collection):
    updated_doc = {"_id": ObjectId(), "user_id": ObjectId(), "image_url": "url", "category": "bottom", "name": "pants", "created_at": datetime.now(), "updated_at": datetime.now()}
    fake_collection.find_one_and_update.return_value = updated_doc
    payload = ClothingUpdate(category="bottom", name="pants")
    res = await clothing_repo.update_clothing(str(updated_doc["_id"]), payload)
    assert isinstance(res, ClothingModel)

@pytest.mark.asyncio
async def test_update_clothing_fail(clothing_repo, fake_collection):
    fake_collection.find_one_and_update.return_value = None
    with pytest.raises(InternalServerError):
        await clothing_repo.update_clothing("64a8f0f0f0f0f0f0f0f0f0f0", ClothingUpdate())

@pytest.mark.asyncio
async def test_get_user_categories(clothing_repo, fake_collection):
    fake_collection.distinct.return_value = ["top", "bottom"]
    categories = await clothing_repo.get_user_categories("64a8f0f0f0f0f0f0f0f0f0f0")
    assert categories == ["top", "bottom"]