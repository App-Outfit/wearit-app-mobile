import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timedelta
from bson import ObjectId

from app.features.auth.auth_service import AuthService
from app.features.auth.auth_schema import (
    AuthSignup, AuthLogin, ForgotPasswordRequest, VerifyResetCodeRequest,
    ResetPasswordRequest
)
from app.core.errors import ConflictError, NotFoundError, UnauthorizedError, ValidationError


@pytest.fixture
def fake_user_data():
    return {
        "email": "test@example.com",
        "password": "supersecret",
        "first_name": "Test",
        "gender": "male",
        "answers": {"style": "casual"}
    }


@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.get_user_by_email = AsyncMock()
    repo.generate_unique_referral_code = AsyncMock(return_value="REF123")
    repo.get_user_by_referral_code = AsyncMock()
    repo.increment_credits = AsyncMock()
    repo.create_user = AsyncMock()
    repo.update_password = AsyncMock()
    repo.delete_user_by_id = AsyncMock()
    return repo


@pytest.fixture
def fake_reset_repo():
    reset_repo = MagicMock()
    reset_repo.upsert_code = AsyncMock()
    reset_repo.get_code_doc = AsyncMock()
    reset_repo.delete_code = AsyncMock()
    return reset_repo


@pytest.fixture
def fake_storage():
    storage = MagicMock()
    storage.delete_account_images = AsyncMock()
    return storage


@pytest.fixture
def fake_email_service():
    service = MagicMock()
    service.send_reset_code = AsyncMock()
    return service


@pytest.fixture
def auth_service(fake_repo, fake_reset_repo, fake_storage, fake_email_service):
    return AuthService(
        repo=fake_repo,
        storage=fake_storage,
        email_service=fake_email_service,
        reset_repo=fake_reset_repo
    )


@pytest.mark.asyncio
async def test_signup_success(auth_service, fake_repo, fake_user_data):
    fake_repo.get_user_by_email.return_value = None
    fake_repo.create_user.return_value = MagicMock(email=fake_user_data["email"])
    data = AuthSignup(**fake_user_data)
    result = await auth_service.signup(data)
    assert result.token is not None
    assert result.message == "Signed up successfully"


@pytest.mark.asyncio
async def test_signup_email_conflict(auth_service, fake_repo, fake_user_data):
    fake_repo.get_user_by_email.return_value = True
    with pytest.raises(ConflictError):
        await auth_service.signup(AuthSignup(**fake_user_data))


@pytest.mark.asyncio
async def test_signup_invalid_referral(auth_service, fake_repo, fake_user_data):
    fake_user_data["referral_code"] = "INVALID"
    fake_repo.get_user_by_email.return_value = None
    fake_repo.get_user_by_referral_code.return_value = None
    with pytest.raises(ValidationError):
        await auth_service.signup(AuthSignup(**fake_user_data))


@pytest.mark.asyncio
async def test_login_success(auth_service, fake_repo, fake_user_data):
    hashed_pw = auth_service.hash_password(fake_user_data["password"])
    fake_repo.get_user_by_email.return_value = MagicMock(
        email=fake_user_data["email"], password=hashed_pw
    )
    data = AuthLogin(email=fake_user_data["email"], password=fake_user_data["password"])
    result = await auth_service.login(data)
    assert result.token
    assert result.message == "Logged in successfully"


@pytest.mark.asyncio
async def test_login_not_found(auth_service, fake_repo, fake_user_data):
    fake_repo.get_user_by_email.return_value = None
    with pytest.raises(NotFoundError):
        await auth_service.login(AuthLogin(**fake_user_data))


@pytest.mark.asyncio
async def test_login_wrong_password(auth_service, fake_repo, fake_user_data):
    fake_repo.get_user_by_email.return_value = MagicMock(
        email=fake_user_data["email"], password=auth_service.hash_password("other")
    )
    with pytest.raises(UnauthorizedError):
        await auth_service.login(AuthLogin(**fake_user_data))


@pytest.mark.asyncio
async def test_delete_account(auth_service, fake_repo, fake_storage):
    user = MagicMock(id=str(ObjectId()))
    result = await auth_service.delete_account(user)
    assert result.message == "Account deleted successfully"
    fake_storage.delete_account_images.assert_called_once_with(user.id)
    fake_repo.delete_user_by_id.assert_called_once_with(user.id)


@pytest.mark.asyncio
async def test_forgot_password(auth_service, fake_repo, fake_email_service):
    fake_repo.get_user_by_email.return_value = MagicMock()
    request = ForgotPasswordRequest(email="user@test.com")
    response = await auth_service.forgot_password(request)
    assert "reset code has been sent" in response.message


@pytest.mark.asyncio
async def test_verify_reset_code_valid(auth_service, fake_reset_repo):
    email = "test@example.com"
    code = "1234"
    fake_reset_repo.get_code_doc.return_value = {
        "code": code, "expires_at": datetime.now() + timedelta(minutes=5)
    }
    result = await auth_service.verify_reset_code(VerifyResetCodeRequest(email=email, code=code))
    assert result.valid is True


@pytest.mark.asyncio
async def test_verify_reset_code_invalid(auth_service, fake_reset_repo):
    email = "test@example.com"
    code = "0000"
    fake_reset_repo.get_code_doc.return_value = {
        "code": "1234", "expires_at": datetime.now() + timedelta(minutes=5)
    }
    result = await auth_service.verify_reset_code(VerifyResetCodeRequest(email=email, code=code))
    assert result.valid is False


@pytest.mark.asyncio
async def test_reset_password_success(auth_service, fake_repo, fake_reset_repo):
    request = ResetPasswordRequest(email="a@b.com", code="1234", new_password="newpassword")
    fake_reset_repo.get_code_doc.return_value = {
        "code": "1234", "expires_at": datetime.now() + timedelta(minutes=5)
    }
    result = await auth_service.reset_password(request)
    assert result.message == "Password reset successfully"

