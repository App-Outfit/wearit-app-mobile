from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.features.auth.auth_repo import AuthRepository
from app.infrastructure.database.mongodb import MongoDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    """ Fonction de dépendance pour obtenir la session de base de données """
    return MongoDB.get_database()

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Instancier le repository pour récupérer l'utilisateur par email
    repo = AuthRepository(db)
    user = await repo.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user
