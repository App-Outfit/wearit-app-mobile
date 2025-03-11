from app.infrastructure.storage.s3_client import S3Client
from app.core.logging_config import logger
from botocore.exceptions import NoCredentialsError

class StorageRepository:
    def __init__(self):
        self.s3_client = S3Client.get_client()
        self.bucket_name = S3Client.get_bucket_name()

    async def _upload_to_s3(self, file, object_name: str):
        """ Fonction interne pour uploader un fichier vers S3 """
        try:
            file.file.seek(0)  # 🔥 S'assurer que la lecture commence au début
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

    async def _delete_from_s3(self, object_name: str):
        """ Fonction interne pour supprimer un fichier de S3 """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
            logger.info(f"🟢 [S3] Deletion successful: {object_name}")
            return True
        except NoCredentialsError:
            logger.error("🔴 [S3] Error: AWS credentials missing")
            return False
        except Exception as e:
            logger.error(f"🔴 [S3] Deletion failed: {e}")
            return False

    async def upload_cloth_image(self, user_id: str, cloth_id: str, file):
        """ Upload an image of a cloth """
        object_name = f"users/{user_id}/clothes/{cloth_id}.jpg"
        return await self._upload_to_s3(file, object_name)

    async def delete_cloth_image(self, user_id: str, cloth_id: str):
        """ Delete an image of a cloth """
        object_name = f"users/{user_id}/clothes/{cloth_id}.jpg"
        return await self._delete_from_s3(object_name)

    async def upload_body_image(self, user_id: str, body_id: str, file):
        """ Upload an image of a body """
        object_name = f"users/{user_id}/bodies/{body_id}.jpg"
        return await self._upload_to_s3(file, object_name)

    async def delete_body_image(self, user_id: str, body_id: str):
        """ Delete an image of a body """
        object_name = f"users/{user_id}/bodies/{body_id}.jpg"
        return await self._delete_from_s3(object_name)
    
    async def delete_account_images(self, user_id: str):
        """ Delete all images of a user """
        try:
            objects = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=f"users/{user_id}/")
            if "Contents" in objects:
                for obj in objects["Contents"]:
                    self.s3_client.delete_object(Bucket=self.bucket_name, Key=obj["Key"])
            logger.info(f"🟢 [S3] Deleted all images for user {user_id}")
            return True
        except NoCredentialsError:
            logger.error("🔴 [S3] Error: AWS credentials missing")
            return False
        except Exception as e:
            logger.error(f"🔴 [S3] Deletion failed: {e}")
            return False