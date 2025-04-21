from src.config.settings import oauth
from fastapi import HTTPException, Request
from src.services.auth_service import authenticate_google_user
import dotenv
import os

dotenv.load_dotenv()

async def get_google_redirect(request: Request):
    return await oauth.google.authorize_redirect(request, os.getenv("GOOGLE_REDIRECT_URI"))

async def handle_google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = await authenticate_google_user(token)
        
        if not user_info:
            raise HTTPException(status_code=401, detail="Google authentication failed")
        
        access_token = await authenticate_google_user(user_info)
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during Google authentication: {str(e)}")