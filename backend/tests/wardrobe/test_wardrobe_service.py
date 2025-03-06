import pytest
from unittest.mock import AsyncMock
from app.services.wardrobe_service import WardrobeService
from app.api.schemas.wardrobe_schema import (
    ClothResponse, ClothCreateResponse, ClothDeleteResponse
)
from app.core.errors import NotFoundError
import io
from fastapi import UploadFile

# 🔥 Ajout d'un mock pour StorageRepository
@pytest.fixture
def mock_storage_repo():
    """Fixture pour mocker le StorageRepository"""
    storage_mock = AsyncMock()
    storage_mock.upload_cloth_image.return_value = "https://mocked_s3.com/test_image.jpg"
    storage_mock.delete_cloth_image.return_value = True
    return storage_mock

@pytest.fixture
def mock_repo():
    """Fixture pour mocker le WardrobeRepository"""
    return AsyncMock()

@pytest.fixture
def service(mock_repo, mock_storage_repo):
    """Fixture pour instancier WardrobeService avec les mocks"""
    return WardrobeService(repository=mock_repo, storage_repo=mock_storage_repo)


@pytest.mark.asyncio
async def test_create_cloth(service, mock_repo, mock_storage_repo):
    """Test de la création d'un vêtement"""
    file_data = io.BytesIO(b"some file data")
    upload_file = UploadFile(file=file_data, filename="test_image.jpg")

    cloth_data = {
        "user_id": "001",
        "name": "Test Jacket",
        "type": "upper",
        "file": upload_file
    }

    response = await service.create_cloth(cloth_data)

    # 🔥 Vérifier le bon fonctionnement
    assert isinstance(response, ClothCreateResponse)
    assert response.message == "Cloth created successfully"

    # Vérifier que l'image a bien été uploadée sur S3
    mock_storage_repo.upload_cloth_image.assert_called_once_with("001", response.id, upload_file)

    # Vérifier que la création du vêtement en base a bien été appelée
    mock_repo.create_cloth.assert_called_once()


@pytest.mark.asyncio
async def test_create_cloth_failure(service, mock_storage_repo):
    """Test de l'échec de création d'un vêtement"""
    file_data = io.BytesIO(b"some file data")
    upload_file = UploadFile(file=file_data, filename="test_image.jpg")

    cloth_data = {
        "user_id": "001",
        "name": "Test Jacket",
        "type": "upper",
        "file": upload_file
    }

    # Simuler un échec d'upload sur S3
    mock_storage_repo.upload_cloth_image.return_value = None

    with pytest.raises(Exception, match="Failed to upload image to S3"):
        await service.create_cloth(cloth_data)


@pytest.mark.asyncio
async def test_get_cloth_by_id(service, mock_repo):
    """Test de la récupération d'un vêtement existant"""
    mock_cloth = {
        "_id": "test_cloth_id",
        "user_id": "001",
        "name": "Nike Hoodie",
        "type": "upper",
        "image_url": "https://example.com/hoodie.jpg"
    }
    mock_repo.get_cloth_by_id.return_value = mock_cloth

    response = await service.get_cloth_by_id("test_cloth_id")

    assert isinstance(response, ClothResponse)
    assert response.id == "test_cloth_id"
    assert response.name == "Nike Hoodie"
    mock_repo.get_cloth_by_id.assert_called_once_with("test_cloth_id")


@pytest.mark.asyncio
async def test_get_cloth_by_id_not_found(service, mock_repo):
    """Test d'erreur si un vêtement n'existe pas"""
    mock_repo.get_cloth_by_id.return_value = None

    with pytest.raises(NotFoundError, match="Cloth test_cloth_id not found"):
        await service.get_cloth_by_id("test_cloth_id")


@pytest.mark.asyncio
async def test_delete_cloth(service, mock_repo, mock_storage_repo):
    """Test de la suppression d'un vêtement"""
    mock_repo.get_cloth_by_id.return_value = {"_id": "test_cloth_id", "user_id": "001"}
    mock_repo.delete_cloth.return_value = True

    response = await service.delete_cloth("test_cloth_id")

    assert isinstance(response, ClothDeleteResponse)
    assert response.message == "Cloth test_cloth_id deleted successfully"

    # Vérifier que l'image est bien supprimée de S3
    mock_storage_repo.delete_cloth_image.assert_called_once_with("001", "test_cloth_id")

    # Vérifier que l'élément est bien supprimé de la base
    mock_repo.delete_cloth.assert_called_once_with("test_cloth_id")


@pytest.mark.asyncio
async def test_delete_cloth_not_found(service, mock_repo):
    """Test d'erreur si un vêtement à supprimer n'existe pas"""
    mock_repo.get_cloth_by_id.return_value = None

    with pytest.raises(NotFoundError, match="Cloth test_cloth_id not found"):
        await service.delete_cloth("test_cloth_id")
