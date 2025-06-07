from bson import ObjectId
import asyncio
from datetime import datetime
from app.core.logging_config import logger
import replicate
from app.core.config import settings
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonItem, TryonDeleteResponse
)
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.core.errors import NotFoundError, UnauthorizedError
import aiohttp
from app.core.sse_manager import sse_manager
from starlette.responses import StreamingResponse
from fastapi import Request

class TryonService:
    def __init__(
        self,
        repo: TryonRepository,
        storage: StorageRepository,
        body_repo: BodyRepository,
        clothing_repo: ClothingRepository
    ):
        self.repo = repo
        self.storage = storage
        self.body_repo = body_repo
        self.clothing_repo = clothing_repo

    async def create_tryon(self, user, payload: TryonCreateRequest) -> TryonCreateResponse:
        body_id = payload.body_id
        clothing_id = payload.clothing_id

        body = await self.body_repo.get_body_by_id(body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("Invalid body")

        cloth = await self.clothing_repo.get_clothing_by_id(clothing_id)
        if not cloth or str(cloth.user_id) != str(user.id):
            raise UnauthorizedError("Invalid clothing")

        existing = await self.repo.get_all_by_body_and_clothing(body_id, clothing_id)
        version = len(existing) + 1

        tryon_id = ObjectId()
        now = datetime.now()

        record = await self.repo.create_tryon(
            tryon_id=tryon_id,
            user_id=user.id,
            body_id=body.id,
            clothing_id=cloth.id,
            version=version,
            created_at=now
        )

        asyncio.create_task(self._call_ia(user.id, body, tryon_id, cloth))

        return TryonCreateResponse(
            tryon_id=str(record.id),
            created_at=record.created_at,
            message="Tryon created",
            status=record.status,
            version=version
        )

    async def _call_ia(self, user_id: str, body, tryon_id: str, clothing):
        logger.info(f"🤖 [IA] Starting virtual try-on for body={body.id} × clothing={clothing.id}")
        replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
        model_ref = settings.REPLICATE_MODEL_REF

        body_url = await self.storage.get_presigned_url(body.image_url)
        clothing_url = await self.storage.get_presigned_url(clothing.image_url)

        mask_field_map = {
            "upper": "mask_upper",
            "lower": "mask_lower",
            "dress": "mask_dress",
        }
        mask_attr = mask_field_map.get(clothing.cloth_type)
        if not mask_attr:
            raise ValueError(f"No mask defined for cloth_type '{clothing.cloth_type}'")
        
        mask_key = getattr(body, mask_attr, None)
        if not mask_key:
            raise ValueError(f"Body has no attribute '{mask_attr}' or it's empty")
        
        mask_url = await self.storage.get_presigned_url(mask_key)
                
        raw_output = replicate.run(
            model_ref,
            input={
                "person": body_url,
                "cloth": clothing_url,
                "mask": mask_url,
                "steps": 50,
                "guidance_scale": 2,
                "return_dict": False,
            },
        )
        output_url = raw_output[0] if isinstance(raw_output, list) else raw_output
        if not isinstance(output_url, str):
            output_url = str(output_url)
        logger.info(f"✅ [IA] Replicate returned: {output_url}")
        
        async with aiohttp.ClientSession() as session:
            async with session.get(output_url) as resp:
                resp.raise_for_status()
                img_bytes = await resp.read()

        s3_key = StoragePathBuilder.tryon(user_id, body.id, tryon_id)
        await self.storage.upload_image(s3_key, img_bytes)

        await self.repo.set_tryon(tryon_id, s3_key)
        logger.info(f"✅ [IA] Output stored at {s3_key}")
        
        public_url = await self.storage.get_presigned_url(s3_key)
        await sse_manager.publish(
            user_id,
            {
                "type":       "tryon_update",
                "tryon_id":   str(tryon_id),
                "output_url": public_url,
                "status":     "ready",
            }
        )
        logger.info(f"✅ [IA] SSE published for user {user_id} with tryon {tryon_id}")

    async def get_all_tryons(self, user_id: str) -> TryonListResponse:
        docs = await self.repo.get_all_by_user(user_id)
        tryons = []
        for doc in docs:
            if doc.output_url:
                url = await self.storage.get_presigned_url(doc.output_url)
            else:
                url = None

            if not url:
                logger.warning(f"🔴 [Tryon] No output URL for tryon {doc.id}, skipping")
                continue

            tryons.append(TryonItem(
                id=str(doc.id),
                output_url=url,
                body_id=str(doc.body_id),
                clothing_id=str(doc.clothing_id),
                status=doc.status,
                created_at=doc.created_at,
                version=doc.version
            ))
        return TryonListResponse(tryons=tryons)

    async def get_tryon_by_id(self, tryon_id: str, user) -> TryonDetailResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise NotFoundError("Tryon not found")

        url = await self.storage.get_presigned_url(doc.output_url)
        return TryonDetailResponse(
            id=str(doc.id),
            output_url=url,
            body_id=str(doc.body_id),
            clothing_id=str(doc.clothing_id),
            status=doc.status,
            version=doc.version,
            created_at=doc.created_at,
            updated_at=doc.updated_at
        )

    async def delete_tryon(self, tryon_id: str, user) -> TryonDeleteResponse:
        doc = await self.repo.get_tryon_by_id(tryon_id)
        if not doc or str(doc.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this tryon")

        await self.storage.delete_image(doc.output_url)
        await self.repo.delete_tryon(tryon_id)
        logger.info(f"🗑️ Deleted tryon {tryon_id}")
        return TryonDeleteResponse(message="Tryon deleted")
    
    def stream_tryon_events(self, request: Request, user_id: str) -> StreamingResponse:
        """
        Retourne un StreamingResponse SSE pour tous les événements tryon de cet user.
        """
        queue = sse_manager.subscribe(user_id)

        async def event_generator():
            try:
                while True:
                    # si le client ferme la connexion, on sort
                    if await request.is_disconnected():
                        break
                    data = await queue.get()
                    yield f"data: {data}\n\n"
            finally:
                sse_manager.unsubscribe(user_id, queue)

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache"},
        )
