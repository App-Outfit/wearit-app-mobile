from app.repositories.storage_repo import StorageRepository
from app.repositories.favorite_repo import FavoriteRepository
from app.api.schemas.favorite_schema import FavoriteCreateResponse, FavoriteResponse, FavoriteListResponse, FavoriteDeleteResponse
from app.core.errors import NotFoundError
from app.core.logging_config import logger
from datetime import datetime
from bson import ObjectId

class FavoriteService:
    def __init__(self, repository: FavoriteRepository = None, storage_repo: StorageRepository = None):
        self.repository = repository or FavoriteRepository()
        self.storage_repo = storage_repo or StorageRepository()

    async def create_favorite(self, favorite: dict):
        """
        Create a new favorite in the wardrobe
        - Check if user exists # TODO
        - Check if clothing items exist
        - Save favorite to database

        outfit = list of clothing items in the favorite outfit
        """
        logger.info(f"🟡 [Service] Creating new favorite in repository")

        print(favorite["outfit"])

        # Check if clothing items exist
        for clothing_id in favorite["outfit"]:
            print(clothing_id)
            if await self.repository.get_clothing_by_id(clothing_id) is None:
                logger.error(f"🔴 [Service] Clothing item {clothing_id} not found")
                raise NotFoundError(f"Clothing item {clothing_id} not found")
            
        # Save favorite to database
        data = {
            "user_id": favorite["user_id"],
            "outfit": favorite["outfit"],
            "created_at": datetime.now()
        }

        inserted_id = await self.repository.create_favorite(data)

        if not inserted_id:
            logger.error(f"🔴 [Service] Failed to create favorite in database")
            raise Exception("Failed to create favorite")
        
        logger.debug(f"🟢 [Service] Favorite created with ID: {inserted_id}")
        return FavoriteCreateResponse(
            id=str(inserted_id), 
            message=f"Favorite created successfully",
            created_at=data["created_at"]
        )
    
    async def get_favorite_by_id(self, favorite_id: str):
        logger.info(f"🟡 [Service] Fetching favorite {favorite_id} from repository")
        favorite = await self.repository.get_favorite_by_id(favorite_id)

        if not favorite:
            logger.warning(f"🔴 [Service] Favorite {favorite_id} not found")
            raise NotFoundError(f"Favorite {favorite_id} not found")
        logger.debug(f"🟢 [Service] Favorite {favorite_id} found")
        return FavoriteResponse(
            id=str(favorite["_id"]),
            user_id=favorite["user_id"],
            outfit=favorite["outfit"]
        )
    
    async def get_favorites(self, user_id: str):
        logger.info(f"🟡 [Service] Fetching favorites for user {user_id}")
        favorites = await self.repository.get_favorites(user_id)

        if not favorites:
            logger.warning(f"🔴 [Service] No favorites found for user {user_id}")
            raise NotFoundError(f"No favorites found for user {user_id}")
        
        logger.debug(f"🟢 [Service] Favorites found for user {user_id}")
        return FavoriteListResponse(favorites=[
            FavoriteResponse(
                id=str(favorite["_id"]),
                user_id=favorite["user_id"],
                outfit=favorite["outfit"]
            ) for favorite in favorites
        ])
    
    async def delete_favorite(self, favorite_id: str):
        logger.info(f"🟡 [Service] Deleting favorite {favorite_id} from repository")

        # Get favorite from database
        favorite = await self.repository.get_favorite_by_id(favorite_id)

        if not favorite:
            logger.warning(f"🔴 [Service] Favorite {favorite_id} not found")
            raise NotFoundError(f"Favorite {favorite_id} not found")

        # Delete favorite from database
        success = await self.repository.delete_favorite(favorite_id)
        
        if not success:
            logger.error(f"🔴 [Service] Failed to delete favorite from database")
            raise Exception("Failed to delete favorite from database")
        
        logger.debug(f"🟢 [Service] Favorite {favorite_id} deleted")
        return FavoriteDeleteResponse(
            message=f"Favorite {favorite_id} deleted successfully"
        )