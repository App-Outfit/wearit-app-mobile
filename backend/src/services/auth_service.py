from services.mongodb_service import mongodb_service
from config.security import create_access_token, get_password_hash
from fastapi import HTTPException, status
from datetime import timedelta

async def create_user(name: str, email: str, passowrd: str):
    """
    Create a new user in the database.
    """
    existing_user = await mongodb_service.find_user_by_email(email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    hashed_password = get_password_hash(passowrd)
    result = await mongodb_service.create_user(name, email, hashed_password)

    access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=60))
    return access_token