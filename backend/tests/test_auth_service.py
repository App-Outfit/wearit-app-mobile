import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from services.auth_service import create_user

@pytest.mark.asyncio
async def test_create_user_success():
    """Test successful user creation and token generation."""

    mock_mongodb_service = AsyncMock()
    mock_mongodb_service.find_user_by_email.return_value = None
    mock_mongodb_service.create_user.return_value = {"inserted_id": "12345"}

    with patch("services.auth_service.mongodb_service", mock_mongodb_service), \
         patch("services.auth_service.get_password_hash", return_value="hashed_password"), \
         patch("services.auth_service.create_access_token", return_value="fake_token"):

        token = await create_user("John Doe", "johndoe@example.com", "securepassword123")
        assert token == "fake_token"
        mock_mongodb_service.create_user.assert_awaited_once_with("John Doe", "johndoe@example.com", "hashed_password")

@pytest.mark.asyncio
async def test_create_user_existing_user():
    """Test user creation when the user already exists in the database."""

    mock_mongodb_service = AsyncMock()
    mock_mongodb_service.find_user_by_email.return_value = {"email": "johndoe@example.com"}

    with patch("services.auth_service.mongodb_service", mock_mongodb_service):
        with pytest.raises(HTTPException) as exc_info:
            await create_user("John Doe", "johndoe@example.com", "securepassword123")

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "User already exists"
