from app.infrastructure.storage.s3_client import S3Client
from app.core.logging_config import logger
from botocore.exceptions import NoCredentialsError

class StorageRepository:
    def __init__(self):
        self.s3_client = S3Client.get_client()
        self.bucket_name = S3Client.get_bucket_name()

    async def upload_cloth_image(self, user_id: str, cloth_id: str, file):
        """ Upload an image to S3 and return its URL """
        object_name = f"users/{user_id}/clothes/{cloth_id}.jpg"
        try:
            # 🔥 Assurer que le fichier est bien positionné au début avant l'upload
            file.file.seek(0)

            # ✅ Utilisation de `upload_fileobj()` pour un fichier en mémoire
            self.s3_client.upload_fileobj(file.file, self.bucket_name, object_name)

            s3_url = f"https://{self.bucket_name}.s3.{self.s3_client.meta.region_name}.amazonaws.com/{object_name}"
            logger.info(f"🟢 [S3] Upload successful: {s3_url}")
            return s3_url
        except NoCredentialsError:
            logger.error("🔴 [S3] Error: AWS credentials missing")
            return None
        except Exception as e:
            logger.error(f"🔴 [S3] Upload failed: {e}")
            return None

    async def delete_cloth_image(self, user_id: str, cloth_id: str):
        """ Delete an image from S3 """
        object_name = f"users/{user_id}/clothes/{cloth_id}.jpg"
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
            logger.info(f"🟢 [S3] Successfully deleted: {object_name}")
            return True
        except Exception as e:
            logger.error(f"🔴 [S3] Error while deleting: {e}")
            return False
