import pytest
import io
from unittest.mock import AsyncMock
from fastapi import UploadFile
from bson import ObjectId
from app.services.body_service import BodyService
from app.api.schemas.body_schema import (
    BodyCreateResponse, BodyResponse, BodyListResponse, BodyDeleteResponse
)
from app.core.errors import NotFoundError


# 🔥 Mock du StorageRepository
@pytest.fixture
def mock_storage_repo():
    """Mock du StorageRepository"""
    storage_mock = AsyncMock()
    storage_mock.upload_body_image.return_value = "https://mocked_s3.com/test_image.jpg"
    storage_mock.delete_body_image.return_value = True
    return storage_mock


# 🔥 Mock du BodyRepository
@pytest.fixture
def mock_repo():
    """Mock du BodyRepository"""
    return AsyncMock()


# 🔥 Instance du BodyService avec les mocks
@pytest.fixture
def service(mock_repo, mock_storage_repo):
    """Fixture pour instancier BodyService avec les mocks"""
    return BodyService(repository=mock_repo, storage_repo=mock_storage_repo)


# ✅ **Test: Création d'un corps**
@pytest.mark.asyncio
async def test_create_body(service, mock_repo, mock_storage_repo):
    """Test de la création d'un body"""
    file_data = io.BytesIO(b"some file data")
    upload_file = UploadFile(file=file_data, filename="test_image.jpg")

    body_data = {
        "user_id": "001",
        "file": upload_file
    }

    response = await service.create_body(body_data)

    # 🔥 Vérifier que l'instance est correcte
    assert isinstance(response, BodyCreateResponse)
    assert response.message == "Body created successfully"

    # 🔥 Vérifier l'upload sur S3
    mock_storage_repo.upload_body_image.assert_called_once_with("001", response.id, upload_file)

    # 🔥 Vérifier que l'élément a été inséré en base
    mock_repo.create_body.assert_called_once()


# ❌ **Test: Échec de la création d'un body (upload S3 échoué)**
@pytest.mark.asyncio
async def test_create_body_failure(service, mock_repo, mock_storage_repo):
    """Test de l'échec de création d'un body"""
    file_data = io.BytesIO(b"some file data")
    upload_file = UploadFile(file=file_data, filename="test_image.jpg")

    body_data = {
        "user_id": "001",
        "file": upload_file
    }

    # Simuler un échec d'upload sur S3
    mock_storage_repo.upload_body_image.return_value = None

    with pytest.raises(Exception, match="Failed to upload image to S3"):
        await service.create_body(body_data)


# ✅ **Test: Récupération d'un body existant**
@pytest.mark.asyncio
async def test_get_body_by_id(service, mock_repo):
    """Test de la récupération d'un body existant"""
    mock_body = {
        "_id": ObjectId(),
        "user_id": "001",
        "image_url": "https://example.com/body.jpg"
    }
    mock_repo.get_body_by_id.return_value = mock_body

    response = await service.get_body_by_id(str(mock_body["_id"]))

    assert isinstance(response, BodyResponse)
    assert response.id == str(mock_body["_id"])
    mock_repo.get_body_by_id.assert_called_once_with(str(mock_body["_id"]))


# ❌ **Test: Récupération d'un body inexistant**
@pytest.mark.asyncio
async def test_get_body_by_id_not_found(service, mock_repo):
    """Test d'erreur si un body n'existe pas"""
    mock_repo.get_body_by_id.return_value = None

    with pytest.raises(NotFoundError, match="Body test_body_id not found"):
        await service.get_body_by_id("test_body_id")


# ✅ **Test: Récupération de tous les bodies d'un utilisateur**
@pytest.mark.asyncio
async def test_get_bodies(service, mock_repo):
    """Test de la récupération des bodies d'un utilisateur"""
    mock_bodies = [
        {"_id": ObjectId(), "user_id": "001", "image_url": "https://example.com/body1.jpg"},
        {"_id": ObjectId(), "user_id": "001", "image_url": "https://example.com/body2.jpg"}
    ]
    mock_repo.get_bodies.return_value = mock_bodies

    response = await service.get_bodies(user_id="001")

    assert isinstance(response, BodyListResponse)
    assert len(response.bodies) == 2
    assert response.bodies[0].user_id == "001"
    assert response.bodies[1].user_id == "001"
    mock_repo.get_bodies.assert_called_once_with("001")


# ❌ **Test: Aucun body trouvé pour un utilisateur**
@pytest.mark.asyncio
async def test_get_bodies_not_found(service, mock_repo):
    """Test d'erreur si aucun body n'est trouvé"""
    mock_repo.get_bodies.return_value = []

    with pytest.raises(NotFoundError, match="No bodies found for user 001"):
        await service.get_bodies(user_id="001")


# ✅ **Test: Suppression d'un body**
@pytest.mark.asyncio
async def test_delete_body(service, mock_repo, mock_storage_repo):
    """Test de la suppression d'un body"""
    mock_repo.get_body_by_id.return_value = {"_id": ObjectId(), "user_id": "001"}
    mock_repo.delete_body.return_value = True

    response = await service.delete_body("test_body_id")

    assert isinstance(response, BodyDeleteResponse)
    assert response.message == "Body test_body_id deleted successfully"

    # 🔥 Vérifier que l'image est bien supprimée de S3
    mock_storage_repo.delete_body_image.assert_called_once_with("001", "test_body_id")

    # 🔥 Vérifier que l'élément est bien supprimé de la base
    mock_repo.delete_body.assert_called_once_with("test_body_id")


# ❌ **Test: Suppression d'un body inexistant**
@pytest.mark.asyncio
async def test_delete_body_not_found(service, mock_repo):
    """Test d'erreur si un body à supprimer n'existe pas"""
    mock_repo.get_body_by_id.return_value = None

    with pytest.raises(NotFoundError, match="Body test_body_id not found"):
        await service.delete_body("test_body_id")
