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
    if not user:
        return {"message": "Invalid input"}, 400

    if not user.name or not user.email or not user.password:
        return {"message": "Invalid input"}, 400
    access_token = await create_user(user.name, user.email, user.password)
    return {"access_token": access_token, "token_type": "bearer"}
