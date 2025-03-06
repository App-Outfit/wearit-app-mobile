import pytest
from unittest.mock import AsyncMock
from passlib.context import CryptContext
from app.services.auth_service import AuthService
from app.api.schemas.auth_schema import AuthSignup, AuthLogin, AuthSignupResponse, AuthLoginResponse
from app.core.errors import ConflictError

# Configuration de CryptContext pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@pytest.fixture
def mock_repo():
    """Mock du AuthRepository"""
    return AsyncMock()

@pytest.fixture
def service(mock_repo):
    """Instancie AuthService avec un repo mocké"""
    return AuthService(repository=mock_repo)

@pytest.mark.asyncio
async def test_signup(service, mock_repo):
    """Test de l'inscription d'un nouvel utilisateur"""
    mock_repo.get_user_by_email.return_value = None  # L'utilisateur n'existe pas
    mock_repo.create_user.return_value = "mock_user_id"  # ID simulé après insertion

    user_data = AuthSignup(email="test@example.com", password="securepassword")
    
    response = await service.signup(user_data)

    assert isinstance(response, AuthSignupResponse)
    assert response.message == "Signed up successfully"
    assert isinstance(response.token, str)

    # Vérifier les appels aux méthodes du repo
    mock_repo.get_user_by_email.assert_called_once_with("test@example.com")
    mock_repo.create_user.assert_called_once()

@pytest.mark.asyncio
async def test_signup_user_already_exists(service, mock_repo):
    """Test d'inscription avec un email déjà utilisé"""
    mock_repo.get_user_by_email.return_value = {"email": "test@example.com"}

    user_data = AuthSignup(email="test@example.com", password="securepassword")

    with pytest.raises(ConflictError, match="User already exists"):
        await service.signup(user_data)

@pytest.mark.asyncio
async def test_login(service, mock_repo):
    """Test de connexion d'un utilisateur"""
    hashed_password = pwd_context.hash("securepassword")  # Hachage avec CryptContext
    mock_repo.get_user_by_email.return_value = {"email": "test@example.com", "hashed_password": hashed_password}

    user_data = AuthLogin(email="test@example.com", password="securepassword")
    
    response = await service.login(user_data)

    assert isinstance(response, AuthLoginResponse)
    assert response.message == "Logged in successfully"
    assert isinstance(response.token, str)

    # Vérifier les appels aux méthodes du repo
    mock_repo.get_user_by_email.assert_called_once_with("test@example.com")

@pytest.mark.asyncio
async def test_login_user_not_found(service, mock_repo):
    """Test de connexion avec un utilisateur inexistant"""
    mock_repo.get_user_by_email.return_value = None

    user_data = AuthLogin(email="notfound@example.com", password="securepassword")

    with pytest.raises(ConflictError, match="User not found"):
        await service.login(user_data)

@pytest.mark.asyncio
async def test_login_incorrect_password(service, mock_repo):
    """Test de connexion avec un mauvais mot de passe"""
    hashed_password = pwd_context.hash("securepassword")  # Hachage avec CryptContext
    mock_repo.get_user_by_email.return_value = {"email": "test@example.com", "hashed_password": hashed_password}

    user_data = AuthLogin(email="test@example.com", password="wrongpassword")

    with pytest.raises(ConflictError, match="Incorrect password"):
        await service.login(user_data)
