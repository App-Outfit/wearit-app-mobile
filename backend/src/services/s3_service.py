import logging
import os
from aiobotocore.session import get_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class S3Service:
    """S3 service class for managing file storage operations.

    It interacts with the AWS S3 service to store and retrieve files.
    """
    def __init__(self, bucket_name="wearit"):
        self.s3_client = None
        self.bucket_name = bucket_name

    async def get_s3_client(self):
        """
        Initialize the S3 client if it is not already created.
        """
        if not self.s3_client:
            session = get_session()
            self.s3_client = await session.create_client(
                "s3",
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION")
            ).__aenter__()

    async def close_s3_client(self):
        """
        Close the S3 client if it is created.
        """
        if self.s3_client:
            await self.s3_client.__aexit__(None, None, None)
            self.s3_client = None

    async def upload_file(self, file_name, file_data):
        """
        Upload a file to the S3 bucket.
        """
        if not self.s3_client:
            await self.get_s3_client()

        try:
            await self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_name,
                Body=file_data
            )
        except Exception as e:
            logger.error(f"Error uploading file to S3: {e}")
            raise e
        
        url = f"https://{self.bucket_name}.s3.amazonaws.com/{file_name}"
        logger.info(f"File uploaded successfully to S3: {url}")
        return url
    
    async def download_file(self, file_name):
        """
        Download a file from the S3 bucket.
        """
        if not self.s3_client:
            await self.get_s3_client()

        try:
            response = await self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=file_name
            )
            file_data = await response["Body"].read()
        except Exception as e:
            logger.error(f"Error downloading file from S3: {e}")
            raise e
        
        return file_data
    
    async def delete_file(self, file_name):
        """
        Delete a file from the S3 bucket.
        """
        if not self.s3_client:
            await self.get_s3_client()

        try:
            await self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_name
            )
        except Exception as e:
            logger.error(f"Error deleting file from S3: {e}")
            raise e
        
        logger.info(f"File deleted successfully from S3: {file_name}")
        return True