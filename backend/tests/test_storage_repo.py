import pytest
import io
from app.repositories.storage_repo import StorageRepository
from unittest.mock import patch
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile

AWS_BUCKET_NAME = "test_wearit"
AWS_REGION = "eu-west-3"

@pytest.fixture
async def storage_repo():
    """Initialise StorageRepository avec un S3 mocké"""
    return StorageRepository()

@pytest.mark.asyncio
async def test_upload_cloth_image(storage_repo, s3_mock):
    """Test l'upload d'une image dans S3"""
    user_id = "001"
    cloth_id = "test_cloth"

    # 🔥 Simuler un fichier en mémoire
    file_data = io.BytesIO(b"test image data")
    upload_file = UploadFile(file=file_data, filename="test_image.jpg")

    # 🔥 Appel de la méthode upload_cloth_image
    image_url = await storage_repo.upload_cloth_image(user_id, cloth_id, upload_file)

    # ✅ Vérifications
    assert image_url is not None, "L'upload doit retourner une URL valide"
    assert image_url.startswith("https://"), "L'URL retournée doit être valide"
    assert "test_cloth.jpg" in image_url, "Le nom de fichier doit être inclus dans l'URL"

@pytest.mark.asyncio
async def test_delete_cloth_image(storage_repo, s3_mock):
    """Test la suppression d'une image de S3"""
    user_id = "001"
    cloth_id = "test_cloth"
    object_name = f"users/{user_id}/clothes/{cloth_id}.jpg"

    # Ajouter l'image dans S3 avant suppression
    s3_mock.put_object(Bucket=AWS_BUCKET_NAME, Key=object_name, Body=b"test image data")

    # Vérifier que l'image est bien présente
    s3_objects_before = s3_mock.list_objects_v2(Bucket=AWS_BUCKET_NAME)
    assert any(obj["Key"] == object_name for obj in s3_objects_before["Contents"]), "L'image doit exister avant suppression"

    # Supprimer l'image via `delete_cloth_image`
    success = await storage_repo.delete_cloth_image(user_id, cloth_id)

    assert success, "La suppression doit retourner True"

    # Vérifier que l'image a bien été supprimée
    s3_objects_after = s3_mock.list_objects_v2(Bucket=AWS_BUCKET_NAME)
    assert "Contents" not in s3_objects_after or not any(obj["Key"] == object_name for obj in s3_objects_after.get("Contents", [])), "L'image doit être supprimée"
