# app/infrastructure/storage/storage_path_builder.py

class StoragePathBuilder:
    """
    Génère tous les chemins S3 pour un utilisateur donné selon la structure suivante :

    {user_id}/
    ├── {body_id}/
    │   ├── original.jpg
    │   ├── upper.png
    │   ├── lower.png
    │   └── dress.png
    ├── {clothing_id}/
    │   ├── original.jpg
    │   └── resized.jpg
    └── tryons/
        └── {body_id}/
            ├── {tryon_id}.jpg
            └── ...
    """
        
    @staticmethod
    def body_original(user_id: str, body_id: str) -> str:
        return f"{user_id}/{body_id}/original.jpg"

    @staticmethod
    def body_mask(user_id: str, body_id: str, mask_type: str) -> str:
        assert mask_type in ["upper", "lower", "dress"], "Invalid mask type"
        return f"{user_id}/{body_id}/{mask_type}.png"

    @staticmethod
    def clothing_original(user_id: str, clothing_id: str) -> str:
        return f"{user_id}/{clothing_id}/original.jpg"

    @staticmethod
    def clothing_resized(user_id: str, clothing_id: str) -> str:
        return f"{user_id}/{clothing_id}/resized.jpg"

    @staticmethod
    def tryon(user_id: str, body_id: str, tryon_id: str) -> str:
        return f"{user_id}/tryons/{body_id}/{tryon_id}.jpg"
