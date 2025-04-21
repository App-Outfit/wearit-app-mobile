# tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

# On importe notre app et les dépendances à override
from app.main import app
from app.api.dependencies import get_db
from app.api.routes.auth_route import get_auth_service
from app.api.dependencies import get_current_user
from app.services.auth_service import AuthService

@pytest.fixture(autouse=True)
def override_dependencies():
    """
    Stubbe, pour chaque test (fonction scope par défaut) :
      - get_db   → retourne un MagicMock(), évite la connexion réelle à MongoDB
      - get_auth_service → retourne un fake AuthService avec tous les CRUD en AsyncMock
      - get_current_user → retourne un dummy user pour les routes protégées
    """
    # 1) stub DB
    app.dependency_overrides[get_db] = lambda: MagicMock()

    # 2) stub AuthService
    fake_svc = MagicMock(spec=AuthService)
    fake_svc.signup         = AsyncMock(return_value={"token": "tok", "message": "Signed up successfully"})
    fake_svc.login          = AsyncMock(return_value={"token": "tok", "message": "Logged in successfully"})
    fake_svc.google_login   = AsyncMock(return_value={"token": "tok", "message": "Logged in with Google successfully"})
    fake_svc.logout         = AsyncMock(return_value={"message": "Logged out successfully"})
    fake_svc.delete_account = AsyncMock(return_value={"message": "Account deleted successfully"})
    app.dependency_overrides[get_auth_service] = lambda: fake_svc

    # 3) stub current_user pour DELETE /auth/account
    dummy_user = MagicMock()
    dummy_user.id = "dummy-id"
    app.dependency_overrides[get_current_user] = lambda: dummy_user

    yield

    # Nettoyage après chaque test
    app.dependency_overrides.clear()

@pytest.fixture(scope="session")
def client():
    """
    TestClient en session scope : construit l'app une seule fois pour tous les tests.
    """
    with TestClient(app) as c:
        yield c

@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.get_user_by_email = AsyncMock()
    repo.create_user = AsyncMock()
    repo.delete_user_by_id = AsyncMock()
    return repo

@pytest.fixture
def fake_storage():
    storage = MagicMock()
    storage.delete_account_images = AsyncMock()
    return storage