from app.repositories.wardrobe_repo import WardrobeRepository
from app.api.schemas.wardrobe import ClothResponse, ClothCreate, ClothCreateResponse
from app.core.errors import NotFoundError
from app.core.logging_config import logger
from datetime import datetime
import uuid

class WardrobeService:
    def __init__(self):
        self.repository = WardrobeRepository()

    async def create_cloth(self, cloth: ClothCreate):
        logger.info(f"🟡 [Service] Creating new cloth in repository")

        # Create a unique ID for the cloth
        cloth_id = str(uuid.uuid4())

        # Upload image to S3

        # Prepare cloth object
        data = {
            "user_id": cloth.user_id,
            "name": cloth.name,
            "type": cloth.type,
            "image_url": cloth.image_url,
            "created_at": datetime.now()
        }

        cloth_id = await self.repository.create_cloth(data)

        if not cloth_id:
            logger.error(f"🔴 [Service] Failed to create cloth")
            raise Exception("Failed to create cloth")
        
        logger.debug(f"🟢 [Service] Cloth created with ID: {cloth_id}")
        return ClothCreateResponse(
            **data,
            id=str(cloth_id), 
            message="Cloth created successfully"
        )

    async def get_cloth_by_id(self, cloth_id: str):
        logger.info(f"🟡 [Service] Fetching cloth {cloth_id} from repository")
        cloth = await self.repository.get_cloth_by_id(cloth_id)

        if not cloth:
            logger.warning(f"🔴 [Service] Cloth {cloth_id} not found")
            raise NotFoundError(f"cloth {cloth_id} not found")
        print(cloth)
        logger.debug(f"🟢 [Service] Cloth {cloth_id} found")
        return ClothResponse(
            user_id=cloth["user_id"],
            name=cloth["name"],
            type=cloth["type"],
            id=str(cloth["_id"]),
            image_url=cloth["image_url"]
        )