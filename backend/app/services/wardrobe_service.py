from app.repositories.wardrobe_repo import WardrobeRepository
from app.repositories.storage_repo import StorageRepository
from app.api.schemas.wardrobe_schema import ClothResponse, ClothCreate, ClothCreateResponse, ClothListResponse, ClothDeleteResponse
from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from datetime import datetime
import uuid
from uuid import UUID

class WardrobeService:
    def __init__(self, repository: WardrobeRepository, storage_repo: StorageRepository = None):
        self.repository = repository
        self.storage_repo = storage_repo or StorageRepository()

    async def create_cloth(self, cloth: ClothCreate):
        """
        Create a new cloth in the wardrobe
        - Upload original image to S3
        - Call pre-processing service for cloth
        - Save cloth_preprocessed to S3
        - Save cloth to database
        """
        logger.info(f"🟡 [Service] Creating new cloth in repository")

        # Generate unique ID for the cloth
        cloth_id = str(uuid.uuid4())

        # Upload original image to S3
        image_url = await self.storage_repo.upload_cloth_image(cloth.user_id, str(cloth_id), cloth.file)

        if not image_url:
            logger.error(f"🔴 [Service] Failed to upload image to S3")
            raise InternalServerError("Failed to upload image to S3")
        
        # TODO: Call pre-processing service for cloth
        # Call pre-processing service for cloth
        #cloth_preprocessed = await self.preprocess_service.process_cloth(cloth.file)

        # Save cloth_preprocessed to S3
        #image_url_preprocessed = await self.storage_repo.upload_cloth_image(cloth.user_id, cloth_id, cloth_preprocessed)

        #if not image_url_preprocessed:
        #    logger.error(f"🔴 [Service] Failed to upload preprocessed image to S3")
        #    raise Exception("Failed to upload preprocessed image to S3")

        # Save cloth to database
        data = {
            "id": cloth_id,
            "user_id": cloth.user_id,
            "name": cloth.name,
            "type": cloth.type,
            "image_url": image_url,
            "created_at": datetime.now()
        }

        inserted_id = await self.repository.create_cloth(data)

        if not inserted_id:
            logger.error(f"🔴 [Service] Failed to create cloth in database")
            raise Exception("Failed to create cloth")
        
        
        logger.debug(f"🟢 [Service] Cloth created with ID: {cloth_id}")
        return ClothCreateResponse(
            id=UUID(cloth_id), 
            message=f"Cloth created successfully",
            image_url=image_url,
            created_at=data["created_at"]
        )

    async def get_cloth_by_id(self, cloth_id: str):
        logger.info(f"🟡 [Service] Fetching cloth {cloth_id} from repository")
        cloth = await self.repository.get_cloth_by_id(cloth_id)

        if not cloth:
            logger.warning(f"🔴 [Service] Cloth {cloth_id} not found")
            raise NotFoundError(f"Cloth {cloth_id} not found")
        logger.debug(f"🟢 [Service] Cloth {cloth_id} found")
        return ClothResponse(
            id=cloth.id,
            user_id=cloth.user_id,
            name=cloth.name,
            type=cloth.type,
            image_url=cloth.image_url,
        )
    
    async def get_clothes(self, user_id: str, cloth_type: str):
        logger.info(f"🟡 [Service] Fetching clothes for user {user_id} and type {cloth_type}")
        clothes = await self.repository.get_clothes(user_id, cloth_type)

        if not clothes:
            logger.warning(f"🔴 [Service] No clothes found for user {user_id} and type {cloth_type}")
            raise NotFoundError(f"No clothes found for user {user_id} and type {cloth_type}")
        
        logger.debug(f"🟢 [Service] Clothes found for user {user_id} and type {cloth_type}")
        return ClothListResponse(clothes=[
            ClothResponse(
                id=str(cloth.id),
                user_id=cloth.user_id,
                name=cloth.name,
                type=cloth.type,
                image_url=str(cloth.image_url)
            ) for cloth in clothes
        ])
    
    async def delete_cloth(self, cloth_id: str):
        logger.info(f"🟡 [Service] Deleting cloth {cloth_id} from repository")

        # Get cloth from database
        cloth = await self.repository.get_cloth_by_id(cloth_id)

        if not cloth:
            logger.warning(f"🔴 [Service] Cloth {cloth_id} not found")
            raise NotFoundError(f"Cloth {cloth_id} not found")

        # Delete image from S3
        success_s3 = await self.storage_repo.delete_cloth_image(cloth.user_id, cloth_id)
        
        if not success_s3:
            logger.error(f"🔴 [Service] Failed to delete image from S3")
            raise InternalServerError("Failed to delete image from S3")
        
        # Delete cloth from database
        succes_db = await self.repository.delete_cloth(cloth_id)
        
        if not succes_db:
            logger.error(f"🔴 [Service] Failed to delete cloth from database")
            raise InternalServerError("Failed to delete cloth from database")
        
        logger.debug(f"🟢 [Service] Cloth {cloth_id} deleted")
        return ClothDeleteResponse(
            message=f"Cloth {cloth_id} deleted successfully"
        )