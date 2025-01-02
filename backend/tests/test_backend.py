import requests
import json
import re

BASE_URL = "http://localhost:8000"
AUTH_URL = BASE_URL + "/api/auth"
already_exist_pattern = re.compile("already exists?", re.IGNORECASE)


def test_simple_get():
    url = BASE_URL
    response = requests.get(url)
    assert response.status_code == 200
    response_data = response.json()
    assert "message" in response_data
    assert response_data["message"] == "Welcome to WearIT API!"


def test_signup():
    url = AUTH_URL + "/signup"
    data = {"name": "test", "email": "test@test.fr", "password": "test"}
    response = requests.post(
        url, json=data, headers={"Content-Type": "application/json"}, timeout=5
    )
    json_response = response.json()
    if response.status_code == 400:
        assert "detail" in json_response
        assert already_exist_pattern.search(json_response["detail"]) is not None
        return
    else:
        assert response.status_code == 200, response.text
    response_data = response.json()
    assert "access_token" in response_data
    assert "token_type" in response_data
    assert response_data["token_type"] == "bearer"

def test_same_login():
    url = AUTH_URL + "/signup"
    data = {"name": "test", "email": "test@test.fr", "password": "test"}
    response = requests.post(
        url, json=data, headers={"Content-Type": "application/json"}, timeout=5
    )

# test_signup()
