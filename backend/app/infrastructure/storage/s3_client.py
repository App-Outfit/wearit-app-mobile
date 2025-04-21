import boto3
from botocore.exceptions import NoCredentialsError
from app.core.logging_config import logger

class S3Client:
    _client = None
    _bucket_name = None

    @classmethod
    async def connect(cls, region: str = None, bucket_name: str = None, access_key: str = None, secret_key: str = None):
        """ Initialize the S3 connection only once """
        if cls._client is None:
            logger.info("🟡 [S3] Initializing connection to AWS S3...")
            cls._bucket_name = bucket_name

            try:
                cls._client = boto3.client(
                    "s3",
                    region_name=region,
                    aws_access_key_id=access_key,
                    aws_secret_access_key=secret_key,
                )
                logger.info("🟢 [S3] Successfully connected to S3")
            except NoCredentialsError:
                logger.error("🔴 [S3] Error: AWS credentials missing")
                raise Exception("AWS credentials are missing or invalid")

    @classmethod
    def get_client(cls):
        """ Return the existing instance of the S3 client """
        if cls._client is None:
            logger.error("🔴 [S3] S3Client is not connected. Call connect() first.")
            raise Exception("S3Client is not connected. Call connect() first.")
        return cls._client

    @classmethod
    def get_bucket_name(cls):
        """ Return the configured bucket name """
        if cls._bucket_name is None:
            logger.error("🔴 [S3] S3 bucket name is not configured")
            raise Exception("S3 bucket name is not configured")
        return cls._bucket_name

    @classmethod
    async def close(cls):
        """ Close the S3 connection (not needed for boto3 but keeps the structure clean) """
        if cls._client:
            cls._client = None
            logger.info("🔴 [S3] S3 connection closed")