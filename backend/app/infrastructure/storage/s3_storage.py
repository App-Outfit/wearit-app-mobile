import boto3
import os

class S3Storage:
    def __init__(self):
        print("🟡 [S3] Initializing S3 client...")
        self.s3 = boto3.client("s3")
        self.bucket = os.getenv("S3_BUCKET_NAME")
        print(f"🟢 [S3] Using bucket: {self.bucket}")

    def get_image_url(self, key: str) -> str:
        url = f"https://{self.bucket}.s3.amazonaws.com/{key}"
        print(f"🟢 [S3] Generated image URL: {url}")
        return url