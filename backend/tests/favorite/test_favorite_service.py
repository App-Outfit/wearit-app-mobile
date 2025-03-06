import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.services.favorite_service import FavoriteService
from app.api.schemas.favorite_schema import (
    FavoriteCreateResponse, FavoriteResponse, FavoriteListResponse, FavoriteDeleteResponse
)
from app.core.errors import NotFoundError


# 🔹 Mock pour le repository
@pytest.fixture
def mock_repo():
    """Mock du `FavoriteRepository`"""
    repo = AsyncMock()
    repo.create_favorite.return_value = ObjectId()
    repo.get_favorite_by_id.return_value = {
        "_id": ObjectId(),
        "user_id": "001",
        "outfit": [str(ObjectId()), str(ObjectId())]
    }
    repo.get_favorites.return_value = [
        {"_id": ObjectId(), "user_id": "001", "outfit": [str(ObjectId())]},
        {"_id": ObjectId(), "user_id": "001", "outfit": [str(ObjectId()), str(ObjectId())]},
    ]
    repo.delete_favorite.return_value = True
    repo.get_clothing_by_id.return_value = {"_id": str(ObjectId()), "name": "T-Shirt"}
    return repo


# 🔹 Mock pour `StorageRepository` (même si non utilisé ici, on garde la structure propre)
@pytest.fixture
def mock_storage_repo():
    return AsyncMock()


# 🔹 Instancier le service avec les mocks
@pytest.fixture
def service(mock_repo, mock_storage_repo):
    return FavoriteService(repository=mock_repo, storage_repo=mock_storage_repo)


# ✅ Test création d'un favori réussi
@pytest.mark.asyncio
async def test_create_favorite(service, mock_repo):
    """Test de la création d'un favori"""
    favorite_data = {
        "user_id": "001",
        "outfit": [str(ObjectId()), str(ObjectId())]
    }

    response = await service.create_favorite(favorite_data)

    assert isinstance(response, FavoriteCreateResponse)
    assert response.message == "Favorite created successfully"
    mock_repo.create_favorite.assert_called_once()  # Vérifie que la DB a été appelée
    for clothing_id in favorite_data["outfit"]:
        mock_repo.get_clothing_by_id.assert_any_call(clothing_id)  # Vérifie la vérification des vêtements


# ❌ Test création d'un favori avec un vêtement inexistant
@pytest.mark.asyncio
async def test_create_favorite_not_found(service, mock_repo):
    """Test d'échec de création d'un favori si un vêtement n'existe pas"""
    mock_repo.get_clothing_by_id.side_effect = [None]  # Simule un vêtement inexistant

    favorite_data = {
        "user_id": "001",
        "outfit": [str(ObjectId()), str(ObjectId())]
    }

    with pytest.raises(NotFoundError, match="Clothing item"):
        await service.create_favorite(favorite_data)


# ✅ Test récupération d'un favori par ID
@pytest.mark.asyncio
async def test_get_favorite_by_id(service, mock_repo):
    """Test de récupération d'un favori existant"""
    favorite_id = str(ObjectId())
    response = await service.get_favorite_by_id(favorite_id)

    assert isinstance(response, FavoriteResponse)
    assert response.user_id == "001"
    mock_repo.get_favorite_by_id.assert_called_once_with(favorite_id)


# ❌ Test récupération d'un favori inexistant
@pytest.mark.asyncio
async def test_get_favorite_by_id_not_found(service, mock_repo):
    """Test d'erreur si un favori n'existe pas"""
    mock_repo.get_favorite_by_id.return_value = None  # Simule l'absence du favori

    with pytest.raises(NotFoundError, match="Favorite .* not found"):
        await service.get_favorite_by_id(str(ObjectId()))


# ✅ Test récupération des favoris d'un utilisateur
@pytest.mark.asyncio
async def test_get_favorites(service, mock_repo):
    """Test de récupération des favoris d'un utilisateur"""
    response = await service.get_favorites("001")

    assert isinstance(response, FavoriteListResponse)
    assert len(response.favorites) == 2
    mock_repo.get_favorites.assert_called_once_with("001")


# ❌ Test récupération d'un utilisateur sans favoris
@pytest.mark.asyncio
async def test_get_favorites_not_found(service, mock_repo):
    """Test d'erreur si aucun favori n'est trouvé pour un utilisateur"""
    mock_repo.get_favorites.return_value = []

    with pytest.raises(NotFoundError, match="No favorites found for user"):
        await service.get_favorites("999")


# ✅ Test suppression d'un favori réussi
@pytest.mark.asyncio
async def test_delete_favorite(service, mock_repo):
    """Test de la suppression d'un favori"""
    favorite_id = str(ObjectId())
    response = await service.delete_favorite(favorite_id)

    assert isinstance(response, FavoriteDeleteResponse)
    assert response.message == f"Favorite {favorite_id} deleted successfully"
    mock_repo.get_favorite_by_id.assert_called_once_with(favorite_id)
    mock_repo.delete_favorite.assert_called_once_with(favorite_id)


# ❌ Test suppression d'un favori inexistant
@pytest.mark.asyncio
async def test_delete_favorite_not_found(service, mock_repo):
    """Test d'erreur si un favori à supprimer n'existe pas"""
    mock_repo.get_favorite_by_id.return_value = None  # Simule un favori inexistant

    with pytest.raises(NotFoundError, match="Favorite .* not found"):
        await service.delete_favorite(str(ObjectId()))
