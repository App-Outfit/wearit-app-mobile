from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import wardrobe_route  # Importing routes
from app.infrastructure.database.mongodb import MongoDB
from app.infrastructure.storage.s3_client import S3Client  # Importing S3 Client
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

MONGO_URL = os.getenv("MONGODB_URI_LOCAL")
DB_NAME = os.getenv("MONGODB_DATABASE_LOCAL")

AWS_REGION = os.getenv("AWS_REGION_NAME")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


# 📌 FastAPI Application Initialization
app = FastAPI(
    title="WearIT API",
    description="Backend for virtual try-on application",
    version="1.0.0",
)

# 📌 CORS Configuration (for cross-domain frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow GET, POST, DELETE, etc.
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """ Initialize MongoDB and S3 connection on startup """
    await MongoDB.connect(MONGO_URL, DB_NAME)
    await S3Client.connect(AWS_REGION, AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY)  # Initialize S3 connection

@app.on_event("shutdown")
async def shutdown_event():
    """ Properly close MongoDB and S3 connection on shutdown """
    await MongoDB.close()
    await S3Client.close()

# 📌 Include API routes
app.include_router(wardrobe_route.router)

# 📌 Entry point when running directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
