import pytest
import asyncio
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId

from app.features.body.body_service import BodyService
from app.features.body.body_schema import BodyUploadResponse, BodyListResponse, BodyItem, BodyMasksResponse
from app.core.errors import NotFoundError, UnauthorizedError


@pytest.fixture
def fake_user():
    return MagicMock(id=str(ObjectId()))


@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.create_body = AsyncMock()
    repo.set_masks = AsyncMock()
    repo.get_all_bodies = AsyncMock()
    repo.get_latest_body = AsyncMock()
    repo.get_body_by_id = AsyncMock()
    repo.delete_body = AsyncMock()
    return repo


@pytest.fixture
def fake_storage():
    storage = MagicMock()
    storage.upload_image = AsyncMock()
    storage.get_presigned_url = AsyncMock(return_value="https://signed.url/fake.png")
    storage.delete_image = AsyncMock()
    return storage


@pytest.fixture
def body_service(fake_repo, fake_storage):
    return BodyService(repo=fake_repo, storage=fake_storage)


@pytest.mark.asyncio
async def test_upload_body(body_service, fake_repo, fake_storage, fake_user):
    image = MagicMock()
    fake_repo.create_body.return_value = MagicMock(id=ObjectId(), image_url="path/to/image", status="pending")
    response = await body_service.upload_body(fake_user, image)
    assert isinstance(response, BodyUploadResponse)
    assert response.status == "pending"
    fake_storage.upload_image.assert_called_once()
    fake_repo.create_body.assert_called_once()


@pytest.mark.asyncio
async def test_get_all_bodies(body_service, fake_repo, fake_storage, fake_user):
    fake_repo.get_all_bodies.return_value = [
        MagicMock(id=ObjectId(), image_url="image1", status="ready", is_default=False, created_at=datetime.now()),
        MagicMock(id=ObjectId(), image_url="image2", status="pending", is_default=True, created_at=datetime.now())
    ]
    result = await body_service.get_all_bodies(fake_user)
    assert isinstance(result, BodyListResponse)
    assert len(result.bodies) == 2
    fake_storage.get_presigned_url.assert_called()


@pytest.mark.asyncio
async def test_get_latest_body_success(body_service, fake_repo, fake_storage, fake_user):
    fake_repo.get_latest_body.return_value = MagicMock(
        id=ObjectId(), image_url="img.jpg", status="ready", is_default=True, created_at=datetime.now())
    result = await body_service.get_latest_body(fake_user)
    assert isinstance(result, BodyItem)
    assert result.status == "ready"


@pytest.mark.asyncio
async def test_get_latest_body_not_found(body_service, fake_repo, fake_user):
    fake_repo.get_latest_body.return_value = None
    with pytest.raises(NotFoundError):
        await body_service.get_latest_body(fake_user)


@pytest.mark.asyncio
async def test_get_masks_success(body_service, fake_repo, fake_storage, fake_user):
    fake_repo.get_body_by_id.return_value = MagicMock(
        user_id=fake_user.id,
        mask_upper="u", mask_lower="l", mask_dress="d", image_url="o"
    )
    result = await body_service.get_masks("bodyid", fake_user)
    assert isinstance(result, BodyMasksResponse)
    fake_storage.get_presigned_url.assert_called()


@pytest.mark.asyncio
async def test_get_masks_unauthorized(body_service, fake_repo, fake_user):
    fake_repo.get_body_by_id.return_value = MagicMock(user_id="someone_else")
    with pytest.raises(UnauthorizedError):
        await body_service.get_masks("bodyid", fake_user)


@pytest.mark.asyncio
async def test_delete_body_success(body_service, fake_repo, fake_storage, fake_user):
    fake_repo.get_body_by_id.return_value = MagicMock(
        user_id=fake_user.id,
        image_url="img", mask_upper="mu", mask_lower="ml", mask_dress=None
    )
    result = await body_service.delete_body("bodyid", fake_user)
    assert result == {"message": "Body deleted"}
    fake_storage.delete_image.assert_any_call("img")
    fake_storage.delete_image.assert_any_call("mu")
    fake_storage.delete_image.assert_any_call("ml")
    fake_repo.delete_body.assert_called_once()


@pytest.mark.asyncio
async def test_delete_body_unauthorized(body_service, fake_repo, fake_user):
    fake_repo.get_body_by_id.return_value = MagicMock(user_id="another_user")
    with pytest.raises(UnauthorizedError):
        await body_service.delete_body("bodyid", fake_user)