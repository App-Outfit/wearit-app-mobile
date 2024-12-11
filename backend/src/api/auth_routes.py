from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from services.auth_service import create_user

router = APIRouter()

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

@router.post("/signup", summary="Create a new user")
async def signup(user: UserSignup):
    """
    Create a new user in the database.
    """
    access_token = await create_user(user.name, user.email, user.password)
    return {"access_token": access_token, "token_type": "bearer"}