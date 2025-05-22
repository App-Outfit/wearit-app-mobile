import pytest
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId
from datetime import datetime
from types import SimpleNamespace

from app.features.tryon.tryon_service import TryonService
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonDeleteResponse
)
from app.core.errors import UnauthorizedError, NotFoundError


@pytest.fixture
def fake_user():
    return MagicMock(id=str(ObjectId()))


@pytest.fixture
def fake_repos():
    return {
        "repo": MagicMock(),
        "storage": MagicMock(),
        "body_repo": MagicMock(),
        "clothing_repo": MagicMock()
    }


@pytest.fixture
def tryon_service(fake_repos):
    for repo in fake_repos.values():
        for attr in [
            'get_all_by_body_and_clothing', 'create_tryon', 'set_tryon',
            'get_all_by_user', 'get_tryon_by_id', 'delete_tryon',
            'get_presigned_url', 'delete_image',
            'get_body_by_id', 'get_clothing_by_id'
        ]:
            setattr(repo, attr, AsyncMock())
    return TryonService(
        repo=fake_repos["repo"],
        storage=fake_repos["storage"],
        body_repo=fake_repos["body_repo"],
        clothing_repo=fake_repos["clothing_repo"]
    )


@pytest.mark.asyncio
async def test_create_tryon_success(tryon_service, fake_user):
    body_id = str(ObjectId())
    clothing_id = str(ObjectId())

    tryon_service.body_repo.get_body_by_id.return_value = SimpleNamespace(user_id=fake_user.id)
    tryon_service.clothing_repo.get_clothing_by_id.return_value = SimpleNamespace(user_id=fake_user.id)
    tryon_service.repo.get_all_by_body_and_clothing.return_value = []
    tryon_service.repo.create_tryon.return_value = SimpleNamespace(
        id=ObjectId(), created_at=datetime.now(), status="pending"
    )

    payload = TryonCreateRequest(body_id=body_id, clothing_id=clothing_id)
    response = await tryon_service.create_tryon(fake_user, payload)

    assert isinstance(response, TryonCreateResponse)
    assert response.status == "pending"
    tryon_service.repo.create_tryon.assert_called_once()


@pytest.mark.asyncio
async def test_create_tryon_unauthorized_body(tryon_service, fake_user):
    tryon_service.body_repo.get_body_by_id.return_value = SimpleNamespace(user_id="other")
    payload = TryonCreateRequest(body_id=str(ObjectId()), clothing_id=str(ObjectId()))

    with pytest.raises(UnauthorizedError):
        await tryon_service.create_tryon(fake_user, payload)


@pytest.mark.asyncio
async def test_create_tryon_unauthorized_clothing(tryon_service, fake_user):
    bid = str(ObjectId())
    tryon_service.body_repo.get_body_by_id.return_value = SimpleNamespace(user_id=fake_user.id)
    tryon_service.clothing_repo.get_clothing_by_id.return_value = SimpleNamespace(user_id="other")
    payload = TryonCreateRequest(body_id=bid, clothing_id=str(ObjectId()))

    with pytest.raises(UnauthorizedError):
        await tryon_service.create_tryon(fake_user, payload)


@pytest.mark.asyncio
async def test_get_all_tryons_success(tryon_service, fake_user):
    tryon_service.repo.get_all_by_user.return_value = [
        SimpleNamespace(
            id=ObjectId(), output_url="s3/fake.png", body_id=ObjectId(),
            clothing_id=ObjectId(), status="ready", created_at=datetime.now(), version=1
        )
    ]
    tryon_service.storage.get_presigned_url.return_value = "https://signed.url/image.png"

    result = await tryon_service.get_all_tryons(fake_user.id)
    assert isinstance(result, TryonListResponse)
    assert len(result.tryons) == 1


@pytest.mark.asyncio
async def test_get_tryon_by_id_success(tryon_service, fake_user):
    tryon = SimpleNamespace(
        id=ObjectId(),
        user_id=fake_user.id,
        output_url="s3/image.png",
        body_id=ObjectId(),
        clothing_id=ObjectId(),
        status="ready",
        version=1,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    tryon_service.repo.get_tryon_by_id.return_value = tryon
    tryon_service.storage.get_presigned_url.return_value = "https://signed.url/output.png"

    result = await tryon_service.get_tryon_by_id(str(tryon.id), fake_user)
    assert isinstance(result, TryonDetailResponse)
    assert result.status == "ready"


@pytest.mark.asyncio
async def test_get_tryon_by_id_not_found(tryon_service, fake_user):
    tryon_service.repo.get_tryon_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await tryon_service.get_tryon_by_id(str(ObjectId()), fake_user)


@pytest.mark.asyncio
async def test_get_tryon_by_id_wrong_owner(tryon_service, fake_user):
    tryon_service.repo.get_tryon_by_id.return_value = SimpleNamespace(user_id="someone_else")
    with pytest.raises(NotFoundError):
        await tryon_service.get_tryon_by_id(str(ObjectId()), fake_user)


@pytest.mark.asyncio
async def test_delete_tryon_success(tryon_service, fake_user):
    tryon = SimpleNamespace(
        id=ObjectId(), user_id=fake_user.id, output_url="s3/output.png"
    )
    tryon_service.repo.get_tryon_by_id.return_value = tryon

    result = await tryon_service.delete_tryon(str(tryon.id), fake_user)
    assert isinstance(result, TryonDeleteResponse)
    tryon_service.storage.delete_image.assert_called_once_with("s3/output.png")
    tryon_service.repo.delete_tryon.assert_called_once_with(str(tryon.id))


@pytest.mark.asyncio
async def test_delete_tryon_unauthorized(tryon_service, fake_user):
    tryon_service.repo.get_tryon_by_id.return_value = SimpleNamespace(user_id="other")
    with pytest.raises(UnauthorizedError):
        await tryon_service.delete_tryon(str(ObjectId()), fake_user)
