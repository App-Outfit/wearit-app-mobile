import pytest
from bson import ObjectId
from app.repositories.wardrobe_repo import WardrobeRepository

@pytest.fixture
async def repo(test_db):
    """Fixture pour instancier `WardrobeRepository` avec la base de test"""
    return WardrobeRepository(db=test_db)

@pytest.mark.asyncio
async def test_create_cloth(repo):
    """Test de l'insertion d'un vêtement dans MongoDB"""
    cloth_data = {
        "user_id": "001",
        "name": "Test Jacket",
        "type": "upper",
        "file": "test.jpg"
    }
    cloth_id = await repo.create_cloth(cloth_data)

    assert isinstance(cloth_id, ObjectId)

    # Vérifier que le vêtement existe bien en base
    found_cloth = await repo.get_cloth_by_id(str(cloth_id))
    assert found_cloth is not None
    assert found_cloth["name"] == "Test Jacket"

@pytest.mark.asyncio
async def test_get_cloth_by_id(repo):
    """Test de récupération d'un vêtement par son ID"""
    cloth_data = {
        "_id": ObjectId(),
        "user_id": "001",
        "name": "Nike Hoodie",
        "type": "upper",
        "image_url": "https://example.com/hoodie.jpg"
    }
    await repo.db.wardrobe.insert_one(cloth_data)

    result = await repo.get_cloth_by_id(str(cloth_data["_id"]))

    assert result is not None
    assert result["name"] == "Nike Hoodie"

@pytest.mark.asyncio
async def test_get_cloth_by_id_not_found(repo):
    """Test de récupération d'un vêtement inexistant"""
    result = await repo.get_cloth_by_id("65f7e1a3c9b3f2d1e87f4a2d")
    assert result is None

@pytest.mark.asyncio
async def test_get_clothes(repo):
    """Test de récupération des vêtements par `user_id` et `type`"""
    # Nettoyage pour éviter les conflits
    await repo.db.wardrobe.delete_many({})

    clothes = [
        {"_id": ObjectId(), "user_id": "001", "name": "Nike Hoodie", "type": "upper", "image_url": "https://example.com/hoodie.jpg"},
        {"_id": ObjectId(), "user_id": "001", "name": "Adidas T-Shirt", "type": "upper", "image_url": "https://example.com/tshirt.jpg"},
        {"_id": ObjectId(), "user_id": "002", "name": "Puma Shorts", "type": "lower", "image_url": "https://example.com/shorts.jpg"}
    ]
    await repo.db.wardrobe.insert_many(clothes)

    result = await repo.get_clothes(user_id="001", cloth_type="upper")

    assert len(result) == 2
    assert result[0]["name"] == "Nike Hoodie"
    assert result[1]["name"] == "Adidas T-Shirt"

@pytest.mark.asyncio
async def test_get_clothes_not_found(repo):
    """Test de récupération de vêtements inexistants"""
    result = await repo.get_clothes(user_id="999", cloth_type="upper")
    assert result == []

@pytest.mark.asyncio
async def test_delete_cloth(repo):
    """Test de suppression d'un vêtement"""
    cloth_data = {
        "_id": ObjectId(),
        "user_id": "001",
        "name": "Test Jacket",
        "type": "upper",
        "image_url": "https://example.com/jacket.jpg"
    }
    await repo.db.wardrobe.insert_one(cloth_data)

    # Vérifier que le vêtement est supprimé
    result = await repo.delete_cloth(str(cloth_data["_id"]))
    assert result is True

    # Vérifier qu'il n'existe plus en base
    found_cloth = await repo.get_cloth_by_id(str(cloth_data["_id"]))
    assert found_cloth is None

@pytest.mark.asyncio
async def test_delete_cloth_not_found(repo):
    """Test de suppression d'un vêtement inexistant"""
    result = await repo.delete_cloth("65f7e1a3c9b3f2d1e87f4a2d")
    assert result is False