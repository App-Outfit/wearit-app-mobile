import pytest
from unittest.mock import AsyncMock
from app.services.wardrobe_service import WardrobeService
from app.api.schemas.wardrobe import ClothCreate, ClothResponse, ClothCreateResponse, ClothListResponse, ClothDeleteResponse
from app.core.errors import NotFoundError

@pytest.fixture
def mock_repo():
    """Fixture pour mocker le WardrobeRepository"""
    return AsyncMock()

@pytest.fixture
def service(mock_repo):
    """Fixture pour instancier WardrobeService avec le repo mocké"""
    return WardrobeService(repository=mock_repo)

@pytest.mark.asyncio
async def test_create_cloth(service, mock_repo):
    """Test de la création d'un vêtement"""
    mock_repo.create_cloth.return_value = "test_cloth_id"

    cloth_data = ClothCreate(
        user_id="001",
        name="Test Jacket",
        type="upper",
        image_url="https://example.com/jacket.jpg"
    )

    response = await service.create_cloth(cloth_data)

    assert isinstance(response, ClothCreateResponse)
    assert response.id == "test_cloth_id"
    assert response.message == "Cloth created successfully"
    mock_repo.create_cloth.assert_called_once()

@pytest.mark.asyncio
async def test_create_cloth_failure(service, mock_repo):
    """Test de l'échec de création d'un vêtement"""
    mock_repo.create_cloth.return_value = None

    cloth_data = ClothCreate(
        user_id="001",
        name="Test Jacket",
        type="upper",
        image_url="https://example.com/jacket.jpg"
    )

    with pytest.raises(Exception, match="Failed to create cloth"):
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
async def test_get_clothes(service, mock_repo):
    """Test de la récupération de la liste des vêtements"""
    mock_clothes = [
        {
            "_id": "test_cloth_id_1",
            "user_id": "001",
            "name": "Nike Hoodie",
            "type": "upper",
            "image_url": "https://example.com/hoodie.jpg"
        },
        {
            "_id": "test_cloth_id_2",
            "user_id": "001",
            "name": "Adidas T-Shirt",
            "type": "upper",
            "image_url": "https://example.com/tshirt.jpg"
        }
    ]
    mock_repo.get_clothes.return_value = mock_clothes

    response = await service.get_clothes(user_id="001", cloth_type="upper")

    assert isinstance(response, ClothListResponse)
    assert len(response.clothes) == 2
    assert response.clothes[0].id == "test_cloth_id_1"
    assert response.clothes[1].id == "test_cloth_id_2"
    mock_repo.get_clothes.assert_called_once_with("001", "upper")

@pytest.mark.asyncio
async def test_get_clothes_not_found(service, mock_repo):
    """Test d'erreur si aucun vêtement n'est trouvé"""
    mock_repo.get_clothes.return_value = []

    with pytest.raises(NotFoundError, match="No clothes found for user 001 and type upper"):
        await service.get_clothes(user_id="001", cloth_type="upper")

@pytest.mark.asyncio
async def test_delete_cloth(service, mock_repo):
    """Test de la suppression d'un vêtement"""
    mock_repo.get_cloth_by_id.return_value = {"_id": "test_cloth_id"}
    mock_repo.delete_cloth.return_value = None

    response = await service.delete_cloth("test_cloth_id")

    assert isinstance(response, ClothDeleteResponse)
    assert response.message == "Cloth test_cloth_id deleted successfully"
    mock_repo.get_cloth_by_id.assert_called_once_with("test_cloth_id")
    mock_repo.delete_cloth.assert_called_once_with("test_cloth_id")

@pytest.mark.asyncio
async def test_delete_cloth_not_found(service, mock_repo):
    """Test d'erreur si un vêtement à supprimer n'existe pas"""
    mock_repo.get_cloth_by_id.return_value = None

    with pytest.raises(NotFoundError, match="Cloth test_cloth_id not found"):
        await service.delete_cloth("test_cloth_id")
