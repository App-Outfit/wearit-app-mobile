import pytest
from httpx import AsyncClient

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_auth_pipeline():
    async with AsyncClient(base_url=BASE_URL) as client:
        # 1. Inscription de l'utilisateur
        signup_payload = {
            "name": "Jean Dupont",
            "email": "jean.dupon@example.com",
            "password": "SecurePass123!"
        }
        signup_response = await client.post("/api/auth/signup", json=signup_payload)
        assert signup_response.status_code == 200
        assert signup_response.json()["access_token"]

        # 2. Connexion de l'utilisateur
        login_payload = {
            "email": "jean.dupont@example.com",
            "password": "SecurePass123!"
        }
        login_response = await client.post("/api/auth/signin", json=login_payload)
        assert login_response.status_code == 200
        assert login_response.json()["access_token"]

        # 3. Demande de réinitialisation de mot de passe
        forgot_password_payload = {
            "email": "jean.dupont@example.com"
        }
        forgot_password_response = await client.post("/api/auth/forgot-password", json=forgot_password_payload)
        assert forgot_password_response.status_code == 200
        assert forgot_password_response.json()["message"] == "Password reset email sent"

        # Simuler l'obtention du token depuis les logs ou la base de données
        reset_token = "SIMULATED_RESET_TOKEN"  # Remplace par une récupération réelle si possible

        # 4. Réinitialisation du mot de passe
        reset_password_payload = {
            "token": reset_token,
            "new_password": "NewSecurePass123!"
        }
        reset_password_response = await client.post("/api/auth/reset-password", json=reset_password_payload)
        assert reset_password_response.status_code == 200
        assert reset_password_response.json()["message"] == "Password reset successful"

        # 5. Connexion avec le nouveau mot de passe
        new_login_payload = {
            "email": "jean.dupont@example.com",
            "password": "NewSecurePass123!"
        }
        new_login_response = await client.post("/api/auth/login", json=new_login_payload)
        assert new_login_response.status_code == 200
        assert new_login_response.json()["access_token"]
