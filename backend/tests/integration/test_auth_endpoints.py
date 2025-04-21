import pytest

@pytest.mark.integration
def test_signup_and_login_flow(client):
    # 1) Inscription
    signup_payload = {"email":"int@user.com","password":"secret123","name":"Integration"}
    r1 = client.post("/auth/signup", json=signup_payload)
    assert r1.status_code == 200
    token = r1.json()["token"]

    # 2) Connexion
    r2 = client.post("/auth/login", json={"email":"int@user.com","password":"secret123"})
    assert r2.status_code == 200
    assert "token" in r2.json()

    # 3) Accès protégé
    r3 = client.delete("/auth/account", headers={"Authorization": f"Bearer {token}"})
    assert r3.status_code == 200
    assert r3.json()["message"] == "Account deleted successfully"
