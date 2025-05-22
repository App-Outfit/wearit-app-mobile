import pytest
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId
from types import SimpleNamespace
from datetime import datetime

from app.features.clothing.clothing_service import ClothingService
from app.features.clothing.clothing_schema import (
    ClothingUploadResponse, ClothingListResponse, ClothingDetailResponse,
    ClothingDeleteResponse, CategoryListResponse, ClothingUpdate
)
from app.core.errors import NotFoundError, UnauthorizedError


@pytest.fixture
def fake_user():
    return MagicMock(id=str(ObjectId()))


@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.create_clothing = AsyncMock()
    repo.get_clothes = AsyncMock()
    repo.get_clothing_by_id = AsyncMock()
    repo.delete_clothing = AsyncMock()
    repo.update_clothing = AsyncMock()
    repo.get_user_categories = AsyncMock()
    return repo


@pytest.fixture
def fake_storage():
    storage = MagicMock()
    storage.upload_image = AsyncMock(return_value="path/to/uploaded.png")
    storage.get_presigned_url = AsyncMock(return_value="https://signed.url/fake.png")
    storage.delete_image_from_url = AsyncMock()
    return storage


@pytest.fixture
def clothing_service(fake_repo, fake_storage):
    return ClothingService(repo=fake_repo, storage=fake_storage)


@pytest.mark.asyncio
async def test_upload_clothing(clothing_service, fake_repo, fake_storage, fake_user):
    image = MagicMock()
    fake_repo.create_clothing.return_value = SimpleNamespace(
        id=ObjectId(),
        image_url="img",
        category="tshirt",
        name="Nike",
        created_at=datetime.now()
    )

    response = await clothing_service.upload_clothing(fake_user, image, "tshirt", "Nike")

    assert isinstance(response, ClothingUploadResponse)
    fake_storage.upload_image.assert_called_once()
    fake_repo.create_clothing.assert_called_once()


@pytest.mark.asyncio
async def test_get_clothes(clothing_service, fake_repo, fake_storage, fake_user):
    fake_repo.get_clothes.return_value = [
        SimpleNamespace(
            id=ObjectId(),
            image_url="a",
            resized_url=None,
            category="shirt",
            name="A",  # ✅ vraie string
            created_at=datetime.now()
        )
    ]

    result = await clothing_service.get_clothes(fake_user)
    assert isinstance(result, ClothingListResponse)
    assert len(result.clothes) == 1
    fake_storage.get_presigned_url.assert_called()


@pytest.mark.asyncio
async def test_get_clothing_by_id_success(clothing_service, fake_repo, fake_storage, fake_user):
    clothing = SimpleNamespace(
        id=ObjectId(),
        user_id=fake_user.id,
        image_url="a",
        resized_url=None,
        category="pants",
        name="Zara",
        created_at=datetime.now()
    )

    fake_repo.get_clothing_by_id.return_value = clothing
    result = await clothing_service.get_clothing_by_id(str(clothing.id), fake_user)
    assert isinstance(result, ClothingDetailResponse)
    assert result.name == "Zara"


@pytest.mark.asyncio
async def test_get_clothing_by_id_not_found(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await clothing_service.get_clothing_by_id("invalid_id", fake_user)


@pytest.mark.asyncio
async def test_get_clothing_by_id_unauthorized(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = MagicMock(user_id="another_id")
    with pytest.raises(UnauthorizedError):
        await clothing_service.get_clothing_by_id("id", fake_user)


@pytest.mark.asyncio
async def test_delete_clothing_success(clothing_service, fake_repo, fake_storage, fake_user):
    clothing = MagicMock(user_id=fake_user.id, image_url="img")
    fake_repo.get_clothing_by_id.return_value = clothing
    result = await clothing_service.delete_clothing("id", fake_user)
    assert isinstance(result, ClothingDeleteResponse)
    fake_storage.delete_image_from_url.assert_called_once_with("img")
    fake_repo.delete_clothing.assert_called_once_with("id")


@pytest.mark.asyncio
async def test_delete_clothing_not_found(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await clothing_service.delete_clothing("id", fake_user)


@pytest.mark.asyncio
async def test_delete_clothing_unauthorized(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = MagicMock(user_id="other")
    with pytest.raises(UnauthorizedError):
        await clothing_service.delete_clothing("id", fake_user)


@pytest.mark.asyncio
async def test_update_clothing_success(clothing_service, fake_repo, fake_storage, fake_user):
    clothing = SimpleNamespace(user_id=fake_user.id)
    updated = SimpleNamespace(
        id=ObjectId(),
        image_url="x",
        resized_url=None,
        category="top",
        name="Y",  # ✅ vraie string
        created_at=datetime.now()
    )

    fake_repo.get_clothing_by_id.return_value = clothing
    fake_repo.update_clothing.return_value = updated

    result = await clothing_service.update_clothing("id", ClothingUpdate(name="Y"), fake_user)
    assert isinstance(result, ClothingDetailResponse)
    assert result.name == "Y"


@pytest.mark.asyncio
async def test_update_clothing_not_found(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await clothing_service.update_clothing("id", ClothingUpdate(name="Z"), fake_user)


@pytest.mark.asyncio
async def test_update_clothing_unauthorized(clothing_service, fake_repo, fake_user):
    fake_repo.get_clothing_by_id.return_value = MagicMock(user_id="unauthorized")
    with pytest.raises(UnauthorizedError):
        await clothing_service.update_clothing("id", ClothingUpdate(name="Z"), fake_user)


@pytest.mark.asyncio
async def test_get_categories(clothing_service, fake_repo, fake_user):
    fake_repo.get_user_categories.return_value = ["jacket", "shirt"]
    result = await clothing_service.get_categories(fake_user)
    assert isinstance(result, CategoryListResponse)
    assert result.categories == ["jacket", "shirt"]
