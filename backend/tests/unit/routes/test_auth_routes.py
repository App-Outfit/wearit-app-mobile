import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.api.routes.auth_route import router as auth_router
from app.services.auth_service import AuthService

client = TestClient(app)
app.include_router(auth_router)

@pytest.fixture(autouse=True)
def override_auth_service(monkeypatch):
    fake_service = MagicMock(spec=AuthService)
    fake_service.signup = AsyncMock(return_value={"token": "tok", "message": "ok"})
    fake_service.login = AsyncMock(return_value={"token": "tok", "message": "ok"})
    monkeypatch.setattr("app.api.routes.auth_route.get_auth_service", lambda: fake_service)

def test_signup_route():
    res = client.post(
        "/auth/signup",
        json={
            "email": "a@b.com",
            "password": "password123",
            "name": "Tester"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "Signed up successfully"
    assert "token" in data

def test_login_route():
    res = client.post(
        "/auth/login",
        json={
            "email": "a@b.com",
            "password": "password123"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "Logged in successfully"
    assert "token" in data

