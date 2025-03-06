import pytest
from bson import ObjectId
from app.repositories.body_repo import BodyRepository


@pytest.fixture
async def repo(test_db):
    """Fixture pour instancier `BodyRepository` avec la base de test"""
    return BodyRepository(db=test_db)


# ✅ **Test: Création d'un body**
@pytest.mark.asyncio
async def test_create_body(repo):
    """Test de l'insertion d'un body dans MongoDB"""
    body_data = {
        "user_id": "001",
        "image_url": "https://example.com/body.jpg"
    }

    body_id = await repo.create_body(body_data)
    assert isinstance(body_id, ObjectId)

    found_body = await repo.get_body_by_id(str(body_id))

    assert found_body is not None
    assert found_body["user_id"] == "001"
    assert found_body["image_url"] == "https://example.com/body.jpg"


# ✅ **Test: Récupération d'un body existant**
@pytest.mark.asyncio
async def test_get_body_by_id(repo):
    """Test de récupération d'un body par son ID"""
    body_data = {
        "_id": ObjectId(),
        "user_id": "001",
        "image_url": "https://example.com/body.jpg"
    }

    await repo.db.bodies.insert_one(body_data)

    result = await repo.get_body_by_id(str(body_data["_id"]))

    assert result is not None
    assert result["user_id"] == "001"
    assert result["image_url"] == "https://example.com/body.jpg"


# ❌ **Test: Récupération d'un body inexistant**
@pytest.mark.asyncio
async def test_get_body_by_id_not_found(repo):
    """Test de récupération d'un body inexistant"""
    result = await repo.get_body_by_id("65f7e1a3c9b3f2d1e87f4a2d")
    assert result is None


# ✅ **Test: Récupération de tous les bodies d'un utilisateur**
@pytest.mark.asyncio
async def test_get_bodies(repo):
    """Test de récupération des bodies par `user_id`"""
    # Nettoyage pour éviter les conflits
    await repo.db.bodies.delete_many({})

    bodies = [
        {"_id": ObjectId(), "user_id": "001", "image_url": "https://example.com/body1.jpg"},
        {"_id": ObjectId(), "user_id": "001", "image_url": "https://example.com/body2.jpg"},
        {"_id": ObjectId(), "user_id": "002", "image_url": "https://example.com/body3.jpg"}
    ]
    await repo.db.bodies.insert_many(bodies)

    result = await repo.get_bodies(user_id="001")

    assert len(result) == 2
    assert result[0]["image_url"] == "https://example.com/body1.jpg"
    assert result[1]["image_url"] == "https://example.com/body2.jpg"


# ❌ **Test: Aucun body trouvé pour un utilisateur**
@pytest.mark.asyncio
async def test_get_bodies_not_found(repo):
    """Test de récupération de bodies inexistants"""
    result = await repo.get_bodies(user_id="999")
    assert result == []


# ✅ **Test: Suppression d'un body**
@pytest.mark.asyncio
async def test_delete_body(repo):
    """Test de suppression d'un body"""
    body_data = {
        "_id": ObjectId(),
        "user_id": "001",
        "image_url": "https://example.com/body.jpg"
    }

    await repo.db.bodies.insert_one(body_data)

    result = await repo.delete_body(str(body_data["_id"]))
    assert result is True

    found_body = await repo.get_body_by_id(str(body_data["_id"]))
    assert found_body is None


# ❌ **Test: Suppression d'un body inexistant**
@pytest.mark.asyncio
async def test_delete_body_not_found(repo):
    """Test de suppression d'un body inexistant"""
    result = await repo.delete_body("65f7e1a3c9b3f2d1e87f4a2d")
    assert result is False
