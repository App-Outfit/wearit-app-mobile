import sys
import os
from fastapi import FastAPI
from src.api.auth_routes import router as auth_router
from src.exceptions.exceptions import http_exception_handler, generic_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from starlette.middleware.sessions import SessionMiddleware
import dotenv
import os

dotenv.load_dotenv()

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

# --- Creating the FastAPI app ---
app = FastAPI(
    title="WearIT Backend API",
    description="API for the WearIT virtual try-on application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

# --- Registering routers and middleware ---
app.include_router(auth_router, prefix="/api", tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Registering exception handlers ---
from src.exceptions.exceptions import http_exception_handler, generic_exception_handler

app.add_exception_handler(Exception, generic_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# --- Root endpoint ---
@app.get("/", summary="Root endpoint")
async def root():
    return {"message": "Welcome to WearIT API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)