from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import List

from fastapi import UploadFile
from app.core.errors import NotFoundError, InternalServerError
from app.core.logging_config import logger
from app.repositories.body_repo import BodyRepository
from app.repositories.storage_repo import StorageRepository
from app.api.schemas.body_schema import (
    BodyCreate, BodyCreateResponse,
    BodyResponse, BodyListResponse, BodyDeleteResponse
)

class BodyService:
    def __init__(
        self,
        repository: BodyRepository,
        storage_repo: StorageRepository = None
    ):
        self.repository = repository
        self.storage = storage_repo or StorageRepository()

    async def create_body(self, body: BodyCreate) -> BodyCreateResponse:
        logger.info("🟡 [Service] create_body for user %s", body.user_id)

        # 1) Générer un ID unique
        body_id = str(uuid4())

        # 2) Upload de l’image
        try:
            image_url = await self.storage.upload_body_image(
                user_id=body.user_id,
                body_id=body_id,
                file=body.file
            )
        except Exception as e:
            logger.error("🔴 [Service] S3 upload error: %s", e)
            raise InternalServerError("Failed to upload image to storage")

        if not image_url:
            logger.error("🔴 [Service] S3 returned empty URL")
            raise InternalServerError("Failed to upload image to storage")

        # 3) Enregistrer en base
        record = {
            "id": body_id,
            "user_id": body.user_id,
            "image_url": image_url,
            "created_at": datetime.now(timezone.utc)
        }

        try:
            inserted_id = await self.repository.create_body(record)
        except InternalServerError:
            # propagate
            raise
        except Exception as e:
            logger.error("🔴 [Service] Repository error: %s", e)
            raise InternalServerError("Failed to create body record")

        if not inserted_id:
            logger.error("🔴 [Service] Repository returned falsy ID")
            raise InternalServerError("Failed to create body record")

        logger.debug("🟢 [Service] Body created: %s", body_id)
        return BodyCreateResponse(
            id=UUID(body_id),
            image_url=image_url,
            created_at=record["created_at"],
            message="Body created successfully"
        )

    async def get_body_by_id(self, body_id: str) -> BodyResponse:
        logger.info("🟡 [Service] get_body_by_id %s", body_id)

        try:
            body = await self.repository.get_body_by_id(body_id)
        except InternalServerError:
            raise
        except Exception as e:
            logger.error("🔴 [Service] Repository error: %s", e)
            raise InternalServerError("Failed to fetch body")

        if not body:
            logger.warning("🔴 [Service] Body %s not found", body_id)
            raise NotFoundError(f"Body {body_id} not found")

        logger.debug("🟢 [Service] Body %s found", body_id)
        return BodyResponse(
            id=body.id,
            user_id=body.user_id,
            image_url=body.image_url,
            created_at=body.created_at
        )

    async def get_bodies(self, user_id: str) -> BodyListResponse:
        logger.info("🟡 [Service] get_bodies for user %s", user_id)

        try:
            bodies = await self.repository.get_bodies(user_id)
        except InternalServerError:
            raise
        except Exception as e:
            logger.error("🔴 [Service] Repository error: %s", e)
            raise InternalServerError("Failed to list bodies")

        if not bodies:
            logger.warning("🔴 [Service] No bodies for user %s", user_id)
            raise NotFoundError(f"No bodies found for user {user_id}")

        logger.debug("🟢 [Service] Found %d bodies", len(bodies))
        return BodyListResponse(
            bodies=[
                BodyResponse(
                    id=body.id,
                    user_id=body.user_id,
                    image_url=body.image_url,
                    created_at=body.created_at
                )
                for body in bodies
            ]
        )

    async def delete_body(self, body_id: str) -> BodyDeleteResponse:
        logger.info("🟡 [Service] delete_body %s", body_id)

        # 1) Vérifier l’existence
        try:
            body = await self.repository.get_body_by_id(body_id)
        except InternalServerError:
            raise
        except Exception as e:
            logger.error("🔴 [Service] Repository error: %s", e)
            raise InternalServerError("Failed to fetch body")

        if not body:
            logger.warning("🔴 [Service] Body %s not found", body_id)
            raise NotFoundError(f"Body {body_id} not found")

        # 2) Supprimer de S3
        try:
            ok = await self.storage.delete_body_image(body.user_id, body_id)
        except Exception as e:
            logger.error("🔴 [Service] S3 delete error: %s", e)
            raise InternalServerError("Failed to delete image from storage")

        if not ok:
            logger.error("🔴 [Service] S3 returned failure on delete")
            raise InternalServerError("Failed to delete image from storage")

        # 3) Supprimer en base
        try:
            deleted = await self.repository.delete_body(body_id)
        except InternalServerError:
            raise
        except Exception as e:
            logger.error("🔴 [Service] Repository delete error: %s", e)
            raise InternalServerError("Failed to delete body record")

        if not deleted:
            logger.error("🔴 [Service] Repository returned failure on delete")
            raise InternalServerError("Failed to delete body record")

        logger.debug("🟢 [Service] Body %s deleted", body_id)
        return BodyDeleteResponse(message=f"Body {body_id} deleted successfully")
