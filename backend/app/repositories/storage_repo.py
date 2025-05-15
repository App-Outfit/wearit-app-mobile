import asyncio
from functools import partial

from botocore.exceptions import NoCredentialsError, BotoCoreError
from fastapi import UploadFile

from app.infrastructure.storage.s3_client import S3Client
from app.core.errors import InternalServerError
from app.core.logging_config import logger


class StorageRepository:
    def __init__(
        self,
        bucket_name: str = None,
        s3_client=None,
    ):
        # Injection possible pour les tests
        self._bucket = bucket_name or S3Client.get_bucket_name()
        self._client = s3_client or S3Client.get_client()

    async def _upload_to_s3(self, file: UploadFile, object_name: str) -> str:
        """
        Upload a file-like object to S3, returns its public URL or raises InternalServerError.
        """
        loop = asyncio.get_running_loop()
        try:
            file.file.seek(0)
            upload_fn = partial(
                self._client.upload_fileobj,
                file.file,
                self._bucket,
                object_name,
                {"ContentType": file.content_type},
            )
            await loop.run_in_executor(None, upload_fn)
        except FileNotFoundError:
            logger.exception("🔴 [S3] File not found")
            raise InternalServerError("File to upload not found")
        except NoCredentialsError:
            logger.exception("🔴 [S3] AWS credentials missing")
            raise InternalServerError("S3 credentials not configured")
        except BotoCoreError:
            logger.exception("🔴 [S3] AWS SDK error")
            raise InternalServerError("Failed to upload to S3")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during upload")
            raise InternalServerError("Failed to upload to S3")

        url = f"https://{self._bucket}.s3.{self._client.meta.region_name}.amazonaws.com/{object_name}"
        logger.info("🟢 [S3] Upload successful: %s", url)
        return url

    async def get_cloth_url(self, object_name: str, expires_in: int = 3600) -> str:
        """
        Génère une URL présignée pour un objet S3 (même clé que celle utilisée à l'upload).
        """
        url = self._client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": self._bucket, "Key": object_name},
            ExpiresIn=expires_in
        )
        logger.info("🟢 [S3] Presigned URL generated for %s", object_name)
        return url

    async def _delete_from_s3(self, object_name: str) -> None:
        """
        Delete an object from S3 or raise InternalServerError.
        """
        loop = asyncio.get_running_loop()
        try:
            delete_fn = partial(
                self._client.delete_object,
                Bucket=self._bucket,
                Key=object_name
            )
            await loop.run_in_executor(None, delete_fn)
        except NoCredentialsError:
            logger.exception("🔴 [S3] AWS credentials missing")
            raise InternalServerError("S3 credentials not configured")
        except BotoCoreError:
            logger.exception("🔴 [S3] AWS SDK error on delete")
            raise InternalServerError("Failed to delete from S3")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during delete")
            raise InternalServerError("Failed to delete from S3")
        logger.info("🟢 [S3] Deletion successful: %s", object_name)

    # Public methods

    async def upload_cloth_image(self, user_id: str, cloth_id: str, file: UploadFile) -> str:
        obj = f"users/{user_id}/clothes/{cloth_id}.jpg"
        return await self._upload_to_s3(file, obj)

    async def delete_cloth_image(self, user_id: str, cloth_id: str) -> None:
        obj = f"users/{user_id}/clothes/{cloth_id}.jpg"
        await self._delete_from_s3(obj)

    # New methods for outfits
    async def upload_outfit_image(self, user_id: str, outfit_id: str, file: UploadFile) -> str:
        obj = f"users/{user_id}/outfits/{outfit_id}.jpg"
        return await self._upload_to_s3(file, obj)

    async def delete_outfit_image(self, user_id: str, outfit_id: str) -> None:
        obj = f"users/{user_id}/outfits/{outfit_id}.jpg"
        await self._delete_from_s3(obj)

    async def delete_account_images(self, user_id: str) -> None:
        """
        Delete all objects under users/{user_id}/
        """
        prefix = f"users/{user_id}/"
        try:
            resp = self._client.list_objects_v2(Bucket=self._bucket, Prefix=prefix)
            keys = [obj["Key"] for obj in resp.get("Contents", [])]
            if keys:
                for key in keys:
                    delete_fn = partial(
                        self._client.delete_object,
                        Bucket=self._bucket,
                        Key=key
                    )
                    delete_fn()
            logger.info("🟢 [S3] Deleted all images for user %s", user_id)
        except NoCredentialsError:
            logger.exception("🔴 [S3] AWS credentials missing")
            raise InternalServerError("S3 credentials not configured")
        except BotoCoreError:
            logger.exception("🔴 [S3] AWS SDK error on batch delete")
            raise InternalServerError("Failed to delete user images")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during batch delete")
            raise InternalServerError("Failed to delete user images")