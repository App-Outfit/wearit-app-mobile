import sys
import os
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from fastapi import FastAPI

from src.api.auth_routes import router as auth_router

app = FastAPI(title="WearIT Backend API")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


@app.get("/", summary="Root endpoint")
async def root():
    return {"message": "Welcome to WearIT API!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
