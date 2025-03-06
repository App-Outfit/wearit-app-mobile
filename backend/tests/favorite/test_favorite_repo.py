import pytest
from bson import ObjectId
from app.repositories.favorite_repo import FavoriteRepository

@pytest.fixture
async def repo(test_db):
    """Fixture pour instancier `FavoriteRepository` avec la base de test"""
    return FavoriteRepository(db=test_db)

@pytest.mark.asyncio
async def test_create_favorite(repo):
    """Test de l'insertion d'un favori dans MongoDB"""
    favorite_data = {
        "user_id": "001",
        "outfit": [str(ObjectId()), str(ObjectId())],  # Liste de vêtements
    }

    favorite_id = await repo.create_favorite(favorite_data)
    assert isinstance(favorite_id, ObjectId)

    found_favorite = await repo.get_favorite_by_id(str(favorite_id))
    
    assert found_favorite is not None
    assert found_favorite["user_id"] == "001"
    assert len(found_favorite["outfit"]) == 2

@pytest.mark.asyncio
async def test_get_favorite_by_id(repo):
    """Test de récupération d'un favori par son ID"""
    favorite_data = {
        "_id": ObjectId(),
        "user_id": "002",
        "outfit": [str(ObjectId()), str(ObjectId())],
    }

    await repo.db.favorites.insert_one(favorite_data)

    result = await repo.get_favorite_by_id(str(favorite_data["_id"]))

    assert result is not None
    assert result["user_id"] == "002"

@pytest.mark.asyncio
async def test_get_favorite_by_id_not_found(repo):
    """Test de récupération d'un favori inexistant"""
    result = await repo.get_favorite_by_id(str(ObjectId()))
    assert result is None

@pytest.mark.asyncio
async def test_get_favorites(repo):
    """Test de récupération des favoris d'un utilisateur"""
    # Nettoyage pour éviter les conflits
    await repo.db.favorites.delete_many({})

    favorites = [
        {"_id": ObjectId(), "user_id": "003", "outfit": [str(ObjectId()), str(ObjectId())]},
        {"_id": ObjectId(), "user_id": "003", "outfit": [str(ObjectId())]},
        {"_id": ObjectId(), "user_id": "004", "outfit": [str(ObjectId()), str(ObjectId()), str(ObjectId())]},
    ]
    await repo.db.favorites.insert_many(favorites)

    result = await repo.get_favorites(user_id="003")

    assert len(result) == 2
    assert result[0]["user_id"] == "003"
    assert result[1]["user_id"] == "003"

@pytest.mark.asyncio
async def test_get_favorites_not_found(repo):
    """Test de récupération de favoris inexistants"""
    result = await repo.get_favorites(user_id="999")
    assert result == []

@pytest.mark.asyncio
async def test_delete_favorite(repo):
    """Test de suppression d'un favori"""
    favorite_data = {
        "_id": ObjectId(),
        "user_id": "005",
        "outfit": [str(ObjectId()), str(ObjectId())],
    }
    await repo.db.favorites.insert_one(favorite_data)

    result = await repo.delete_favorite(str(favorite_data["_id"]))
    assert result is True

    found_favorite = await repo.get_favorite_by_id(str(favorite_data["_id"]))
    assert found_favorite is None

@pytest.mark.asyncio
async def test_delete_favorite_not_found(repo):
    """Test de suppression d'un favori inexistant"""
    result = await repo.delete_favorite(str(ObjectId()))
    assert result is False
