# app/repositories/storage_repo.py

import asyncio
from typing import Optional

from botocore.exceptions import NoCredentialsError, BotoCoreError
from fastapi import UploadFile

from app.infrastructure.storage.s3_client import S3Client
from app.core.errors import InternalServerError
from app.core.logging_config import logger


class StorageRepository:
    def __init__(
        self,
        bucket_name: str = None,
        s3_client = None,
    ):
        # Injection possible pour les tests
        self._bucket = bucket_name or S3Client.get_bucket_name()
        self._client = s3_client or S3Client.get_client()

    async def _upload_to_s3(self, file: UploadFile, object_name: str) -> str:
        """
        Upload a file-like object to S3, returns its public URL or raises InternalServerError.
        """
        # S3 SDK est bloquant, on le déporte dans un threadpool
        loop = asyncio.get_running_loop()
        try:
            file.file.seek(0)
            await loop.run_in_executor(
                None,
                self._client.upload_fileobj,
                file.file,
                self._bucket,
                object_name
            )
        except NoCredentialsError:
            logger.exception("🔴 [S3] AWS credentials missing")
            raise InternalServerError("S3 credentials not configured")
        except BotoCoreError as e:
            logger.exception("🔴 [S3] AWS SDK error")
            raise InternalServerError("Failed to upload to S3")
        except Exception as e:
            logger.exception("🔴 [S3] Unexpected error during upload")
            raise InternalServerError("Failed to upload to S3")

        url = (
            f"https://{self._bucket}"
            f".s3.{self._client.meta.region_name}.amazonaws.com/{object_name}"
        )
        logger.info("🟢 [S3] Upload successful: %s", url)
        return url

    async def _delete_from_s3(self, object_name: str) -> None:
        """
        Delete an object from S3 or raise InternalServerError.
        """
        loop = asyncio.get_running_loop()
        try:
            await loop.run_in_executor(
                None,
                self._client.delete_object,
                {"Bucket": self._bucket, "Key": object_name}
            )
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

    async def upload_body_image(self, user_id: str, body_id: str, file: UploadFile) -> str:
        obj = f"users/{user_id}/bodies/{body_id}.jpg"
        return await self._upload_to_s3(file, obj)

    async def delete_body_image(self, user_id: str, body_id: str) -> None:
        obj = f"users/{user_id}/bodies/{body_id}.jpg"
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
                    self._client.delete_object(Bucket=self._bucket, Key=key)
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
