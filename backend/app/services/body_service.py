from app.repositories.storage_repo import StorageRepository
from app.repositories.body_repo import BodyRepository
from app.api.schemas.body_schema import BodyCreate, BodyCreateResponse, BodyResponse, BodyListResponse, BodyDeleteResponse
from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from datetime import datetime
from uuid import UUID
import uuid

class BodyService:
    def __init__(self, repository: BodyRepository, storage_repo: StorageRepository = None):
        self.repository = repository
        self.storage_repo = storage_repo or StorageRepository()

    async def create_body(self, body: BodyCreate):
        """
        Create a new body in the wardrobe
        - Upload original image to S3
        - Call pre-processing service for body
        - Save body_preprocessed to S3
        - Save body to database
        """
        logger.info(f"🟡 [Service] Creating new body in repository")

        # Generate unique ID for the body
        body_id = str(uuid.uuid4())

        # Upload original image to S3
        image_url = await self.storage_repo.upload_body_image(body.user_id, str(body_id), body.file)

        if not image_url:
            logger.error(f"🔴 [Service] Failed to upload image to S3")
            raise InternalServerError("Failed to upload image to S3")
        
        # Call pre-processing service for body
        # TODO: Add pre-processing service
        #body_preprocessed = await self.preprocess_service.process_body(body.file)

        # Save body_preprocessed to S3
        #image_url_preprocessed = await self.storage_repo.upload_body_image(body.user_id, body_id, body_preprocessed)

        #if not image_url_preprocessed:
        #    logger.error(f"🔴 [Service] Failed to upload preprocessed image to S3"
        #    raise Exception("Failed to upload preprocessed image to S3")
        
        # Save body to database
        data = {
            "id": body_id,
            "user_id": body.user_id,
            "image_url": image_url,
            "created_at": datetime.now()
        }

        inserted_id = await self.repository.create_body(data)

        if not inserted_id:
            logger.error(f"🔴 [Service] Failed to create body in database")
            raise InternalServerError("Failed to create body")
        
        logger.debug(f"🟢 [Service] Body created with ID: {body_id}")
        return BodyCreateResponse(
            id=UUID(body_id), 
            message=f"Body created successfully",
            image_url=image_url,
            created_at=data["created_at"]
        )
    
    async def get_body_by_id(self, body_id: str):
        logger.info(f"🟡 [Service] Fetching body {body_id} from repository")
        body = await self.repository.get_body_by_id(body_id)

        if not body:
            logger.warning(f"🔴 [Service] Body {body_id} not found")
            raise NotFoundError(f"Body {body_id} not found")
        logger.debug(f"🟢 [Service] Body {body_id} found")
        return BodyResponse(
            id=body.id,
            user_id=body.user_id,
            image_url=body.image_url,
        )
    
    async def get_bodies(self, user_id: UUID):
        logger.info(f"🟡 [Service] Fetching bodies for user {user_id}")
        bodies = await self.repository.get_bodies(user_id)

        if not bodies:
            logger.warning(f"🔴 [Service] No bodies found for user {user_id}")
            raise NotFoundError(f"No bodies found for user {user_id}")
        
        logger.debug(f"🟢 [Service] Bodies found for user {user_id}")
        return BodyListResponse(bodies=[
            BodyResponse(
                id=body.id,
                user_id=body.user_id,
                image_url=str(body.image_url)
            ) for body in bodies
        ])
    
    async def delete_body(self, body_id: str):
        logger.info(f"🟡 [Service] Deleting body {body_id} from repository")

        # Get body from database
        body = await self.repository.get_body_by_id(body_id)

        if not body:
            logger.warning(f"🔴 [Service] Body {body_id} not found")
            raise NotFoundError(f"Body {body_id} not found")

        # Delete image from S3
        success_s3 = await self.storage_repo.delete_body_image(body.user_id, body_id)
        
        if not success_s3:
            logger.error(f"🔴 [Service] Failed to delete image from S3")
            raise InternalServerError("Failed to delete image from S3")
        
        # Delete body from database
        succes_db = await self.repository.delete_body(body_id)
        
        if not succes_db:
            logger.error(f"🔴 [Service] Failed to delete body from database")
            raise InternalServerError("Failed to delete body from database")
        
        logger.debug(f"🟢 [Service] Body {body_id} deleted")
        return BodyDeleteResponse(
            message=f"Body {body_id} deleted successfully"
        )