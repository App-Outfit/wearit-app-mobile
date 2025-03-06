import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.wardrobe_repo import WardrobeRepository
from app.services.wardrobe_service import WardrobeService

@pytest.fixture
def client(test_db):
    """Crée un client de test avec la base MongoDB de test injectée."""
    app.dependency_overrides[WardrobeService] = lambda: WardrobeService(WardrobeRepository(test_db))
    return TestClient(app)

@pytest.mark.asyncio
async def test_create_cloth(client):
    """Test de l'endpoint POST /wardrobe/clothes"""
    payload = {
        "user_id": "001",
        "name": "Nike Jacket",
        "type": "upper",
        "image_url": "https://example.com/jacket.jpg"
    }

    response = client.post("/wardrobe/clothes", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["message"] == "Cloth created successfully"
    assert "created_at" in data

# @pytest.mark.asyncio
# async def test_get_cloth(client, test_db):
#     """Test de l'endpoint GET /wardrobe/clothes/{cloth_id}"""
#     repo = WardrobeRepository(test_db)
    
#     # Ajouter un vêtement manuellement en base
#     cloth_data = {
#         "user_id": "001",
#         "name": "Adidas T-Shirt",
#         "type": "upper",
#         "image_url": "https://example.com/tshirt.jpg"
#     }
#     cloth_id = await repo.create_cloth(cloth_data)

#     response = client.get(f"/wardrobe/clothes/{cloth_id}")

#     assert response.status_code == 200
#     data = response.json()
#     assert data["id"] == str(cloth_id)
#     assert data["name"] == "Adidas T-Shirt"
#     assert data["type"] == "upper"

@pytest.mark.asyncio
async def test_get_cloth_not_found(client):
    """Test GET /wardrobe/clothes/{cloth_id} avec un ID inexistant"""
    response = client.get("/wardrobe/clothes/65f7e1a3c9b3f2d1e87f4a2d")
    assert response.status_code == 404
    assert response.json() == {"detail": "Cloth 65f7e1a3c9b3f2d1e87f4a2d not found"}

# @pytest.mark.asyncio
# async def test_get_clothes(client, test_db):
#     """Test de l'endpoint GET /wardrobe/clothes avec user_id et type"""
#     repo = WardrobeRepository(test_db)

#     # Nettoyage pour éviter les conflits
#     await test_db.wardrobe.delete_many({})

#     # Ajouter des vêtements en base
#     clothes = [
#         {"user_id": "001", "name": "Nike Hoodie", "type": "upper", "image_url": "https://example.com/hoodie.jpg"},
#         {"user_id": "001", "name": "Adidas Shorts", "type": "lower", "image_url": "https://example.com/shorts.jpg"},
#         {"user_id": "002", "name": "Puma Jacket", "type": "upper", "image_url": "https://example.com/jacket.jpg"},
#     ]
#     await test_db.wardrobe.insert_many(clothes)

#     response = client.get("/wardrobe/clothes", params={"user_id": "001", "cloth_type": "upper"})

#     assert response.status_code == 200
#     data = response.json()
#     assert len(data["clothes"]) == 1
#     assert data["clothes"][0]["name"] == "Nike Hoodie"

@pytest.mark.asyncio
async def test_get_clothes_not_found(client):
    """Test GET /wardrobe/clothes avec un user_id inexistant"""
    response = client.get("/wardrobe/clothes", params={"user_id": "999", "cloth_type": "upper"})
    assert response.status_code == 404
    assert response.json() == {"detail": "No clothes found for user 999 and type upper"}

@pytest.mark.asyncio
async def test_delete_cloth(client, test_db):
    """Test de l'endpoint DELETE /wardrobe/clothes/{cloth_id}"""
    repo = WardrobeRepository(test_db)

    # Ajouter un vêtement en base
    cloth_data = {
        "user_id": "001",
        "name": "Nike Sneakers",
        "type": "upper",
        "image_url": "https://example.com/sneakers.jpg"
    }
    cloth_id = await repo.create_cloth(cloth_data)

    response = client.delete(f"/wardrobe/clothes/{cloth_id}")

    assert response.status_code == 200
    assert response.json() == {"message": f"Cloth {cloth_id} deleted successfully"}

    # Vérifier que le vêtement n'existe plus
    result = await repo.get_cloth_by_id(str(cloth_id))
    assert result is None

@pytest.mark.asyncio
async def test_delete_cloth_not_found(client):
    """Test DELETE /wardrobe/clothes/{cloth_id} avec un ID inexistant"""
    response = client.delete("/wardrobe/clothes/65f7e1a3c9b3f2d1e87f4a2d")
    assert response.status_code == 404
    assert response.json() == {"detail": "Cloth 65f7e1a3c9b3f2d1e87f4a2d not found"}