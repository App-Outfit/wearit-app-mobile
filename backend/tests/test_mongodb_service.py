import pytest
from src.services.mongodb_service import MongoDBService
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_create_user():
    """Test creating a user in the MongoDB database."""

    mock_db = AsyncMock()
    mock_db.users.insert_one.return_value = AsyncMock(inserted_id="12345")

    with patch("services.mongodb_service.get_mongo_database", return_value=mock_db):
        service = MongoDBService()
        result = await service.create_user("John Doe", "johndoe@example.com", "hashed_password")

        assert result.inserted_id == "12345"
        mock_db.users.insert_one.assert_awaited_once()

@pytest.mark.asyncio
async def test_find_user_by_email():
    """Test finding a user by email."""

    mock_db = AsyncMock()
    mock_user = {"username": "John Doe", "email": "johndoe@example.com"}
    mock_db.users.find_one.return_value = mock_user

    with patch("services.mongodb_service.get_mongo_database", return_value=mock_db):
        service = MongoDBService()
        user = await service.find_user_by_email("johndoe@example.com")

        assert user == mock_user
        mock_db.users.find_one.assert_awaited_once_with({"email": "johndoe@example.com"})
