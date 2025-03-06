import pytest
from bson import ObjectId
from app.repositories.auth_repo import AuthRepository

@pytest.fixture
async def repo(test_db):
    """Fixture pour instancier `AuthRepository` avec la base de test"""
    return AuthRepository(db=test_db)

@pytest.mark.asyncio
async def test_create_user(repo):
    """Test de la création d'un utilisateur dans MongoDB"""
    user_data = {
        "email": "test@example.com",
        "hashed_password": "hashedpassword123",
        "created_at": "2025-03-06T12:00:00"
    }
    
    user_id = await repo.create_user(user_data)
    
    assert isinstance(user_id, ObjectId)  # Vérifie que l'ID retourné est bien un ObjectId

    # Vérifie que l'utilisateur a bien été inséré
    found_user = await repo.get_user_by_email("test@example.com")
    
    assert found_user is not None
    assert found_user["email"] == "test@example.com"
    assert found_user["hashed_password"] == "hashedpassword123"

@pytest.mark.asyncio
async def test_get_user_by_email(repo):
    """Test de récupération d'un utilisateur existant"""
    user_data = {
        "_id": ObjectId(),
        "email": "existing@example.com",
        "hashed_password": "hashedpassword456",
        "created_at": "2025-03-06T12:05:00"
    }

    await repo.db.users.insert_one(user_data)

    result = await repo.get_user_by_email("existing@example.com")

    assert result is not None
    assert result["email"] == "existing@example.com"
    assert result["hashed_password"] == "hashedpassword456"

@pytest.mark.asyncio
async def test_get_user_by_email_not_found(repo):
    """Test de récupération d'un utilisateur inexistant"""
    result = await repo.get_user_by_email("notfound@example.com")
    assert result is None  # Vérifie que la fonction retourne None si l'utilisateur n'existe pas
