import pytest
from fastapi import Request
from unittest.mock import AsyncMock, MagicMock, patch
from httpx import HTTPStatusError
from datetime import datetime

from app.services.auth_service import AuthService
from app.repositories.auth_repo import UserInDB
from app.repositories.storage_repo import StorageRepository
from app.api.schemas.auth_schema import AuthSignup, AuthLogin, AuthGoogleResponse
from app.core.errors import (
    ConflictError, NotFoundError, UnauthorizedError,
    ValidationError, InternalServerError
)

@pytest.mark.asyncio
async def test_signup_success(fake_repo, fake_storage):
    fake_repo.get_user_by_email.return_value = None
    fake_user = UserInDB(
        id="1",
        email="foo@bar.com",
        password="hashedpassword123!",
        name="Foo",
        created_at=datetime.now()
    )
    fake_repo.create_user.return_value = fake_user

    service = AuthService(repo=fake_repo, storage=fake_storage)
    res = await service.signup(
        AuthSignup(email="foo@bar.com", password="password1", name="Foo")
    )
    assert res.token
    assert res.message == "Signed up successfully"
    fake_repo.get_user_by_email.assert_awaited_once_with("foo@bar.com")
    fake_repo.create_user.assert_awaited_once()

@pytest.mark.asyncio
async def test_signup_conflict(fake_repo, fake_storage):
    fake_repo.get_user_by_email.return_value = UserInDB(
        id="1",
        email="foo@bar.com",
        password="hashedpassword123!",
        name="Foo",
        created_at=datetime.now()
    )
    service = AuthService(repo=fake_repo, storage=fake_storage)
    with pytest.raises(ConflictError):
        await service.signup(
            AuthSignup(email="foo@bar.com", password="password1", name="Foo")
        )

@pytest.mark.asyncio
async def test_signup_db_error(fake_repo, fake_storage):
    fake_repo.get_user_by_email.return_value = None
    fake_repo.create_user.side_effect = Exception("db fail")

    service = AuthService(repo=fake_repo, storage=fake_storage)
    with pytest.raises(InternalServerError):
        await service.signup(
            AuthSignup(email="bar@foo.com", password="password1", name="Bar")
        )

@pytest.mark.asyncio
async def test_login_success(fake_repo, fake_storage):
    user = UserInDB(
        id="1",
        email="a@b.com",
        password=AuthService(repo=None, storage=None).hash_password("secret123"),
        name="A",
        created_at=datetime.now()
    )
    fake_repo.get_user_by_email.return_value = user

    service = AuthService(repo=fake_repo, storage=fake_storage)
    res = await service.login(
        AuthLogin(email="a@b.com", password="secret123")
    )
    assert res.token
    assert res.message == "Logged in successfully"

@pytest.mark.asyncio
async def test_login_not_found(fake_repo, fake_storage):
    fake_repo.get_user_by_email.return_value = None
    service = AuthService(repo=fake_repo, storage=fake_storage)
    with pytest.raises(NotFoundError):
        await service.login(
            AuthLogin(email="x@y.com", password="password1")
        )

@pytest.mark.asyncio
async def test_login_unauthorized(fake_repo, fake_storage):
    wrong_hash = AuthService(repo=None, storage=None).hash_password("right")
    fake_repo.get_user_by_email.return_value = UserInDB(
        id="1", email="u@u.com", password=wrong_hash, name="U", created_at=datetime.now()
    )
    service = AuthService(repo=fake_repo, storage=fake_storage)
    with pytest.raises(UnauthorizedError):
        await service.login(
            AuthLogin(email="u@u.com", password="password1")
        )

@pytest.mark.asyncio
async def test_google_login_missing_code(fake_repo, fake_storage):
    service = AuthService(repo=fake_repo, storage=fake_storage)
    req = Request(scope={"type": "http", "query_string": b""})
    with pytest.raises(ValidationError):
        await service.google_login(req)

# Vous pouvez ensuite ajouter :
# - test_google_login_token_exchange_error (monkeypatch httpx.AsyncClient.post → HTTPStatusError)
# - test_google_login_no_access_token (retour JSON sans clé "access_token")
# - test_google_login_userinfo_error (monkeypatch httpx.AsyncClient.get → HTTPStatusError)
# - test_google_login_success_new_user + existing_user
