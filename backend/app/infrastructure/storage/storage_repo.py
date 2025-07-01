import asyncio
from functools import partial
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError, BotoCoreError
from typing import Union

from app.core.logging_config import logger
from app.core.errors import InternalServerError
from app.infrastructure.storage.s3_client import S3Client
from io import BytesIO

class StorageRepository:
    def __init__(self, bucket_name: str = None, s3_client=None):
        self._bucket = bucket_name or S3Client.get_bucket_name()
        self._client = s3_client or S3Client.get_client()

    async def upload_image(self, object_key: str, file: Union[UploadFile, bytes, bytearray]) -> str:
        """
        Upload a file to S3 at the specified object_key. Returns the key (not URL).
        """
        loop = asyncio.get_running_loop()
        try:
            # Prépare le stream et le content type
            if isinstance(file, (bytes, bytearray)):
                stream = BytesIO(file)
                content_type = "image/png"
            else:
                # fichier FastAPI UploadFile
                await file.seek(0)
                stream = file.file
                content_type = file.content_type or "application/octet-stream"

            # Lance l'upload en thread pool pour ne pas bloquer l'event loop
            upload_fn = partial(
                self._client.upload_fileobj,
                stream,
                self._bucket,
                object_key,
                {"ContentType": content_type},
            )
            await loop.run_in_executor(None, upload_fn)
        except (FileNotFoundError, NoCredentialsError, BotoCoreError) as e:
            logger.exception(f"🔴 [S3] Upload error: {e}")
            raise InternalServerError("Failed to upload image")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during upload")
            raise InternalServerError("Failed to upload image")
        logger.info("🟢 [S3] Uploaded: %s", object_key)
        return object_key

    async def get_presigned_url(self, object_key: str, expires_in: int = 3600) -> str:
        """
        Generate a presigned URL for secure access to S3 object.
        """
        logger.info("🔑 [S3] Generating presigned URL for %s", object_key)
        try:
            url = self._client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": self._bucket, "Key": object_key},
                ExpiresIn=expires_in
            )
        except (NoCredentialsError, BotoCoreError) as e:
            logger.exception(f"🔴 [S3] Presign error: {e}")
            raise InternalServerError("Failed to generate presigned URL")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during presign")
            raise InternalServerError("Failed to generate presigned URL")
        return url

    async def delete_image(self, object_key: str) -> None:
        """
        Delete an object from S3.
        """
        loop = asyncio.get_running_loop()
        try:
            delete_fn = partial(
                self._client.delete_object,
                Bucket=self._bucket,
                Key=object_key
            )
            await loop.run_in_executor(None, delete_fn)
        except (NoCredentialsError, BotoCoreError) as e:
            logger.exception(f"🔴 [S3] Delete error: {e}")
            raise InternalServerError("Failed to delete image")
        except Exception:
            logger.exception("🔴 [S3] Unexpected error during delete")
            raise InternalServerError("Failed to delete image")
        logger.info("🟢 [S3] Deleted: %s", object_key)

    async def delete_image_from_url(self, url: str) -> None:
        """
        Extracts object_key from URL and deletes it from S3.
        """
        object_key = url.split(".amazonaws.com/")[-1]
        await self.delete_image(object_key)