from bson import ObjectId
import asyncio
from datetime import datetime
from app.core.logging_config import logger
from app.core.config import settings
from app.features.tryon.tryon_repo import TryonRepository
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.features.tryon.tryon_schema import (
    TryonCreateRequest, TryonCreateResponse,
    TryonListResponse, TryonDetailResponse,
    TryonItem, TryonDeleteResponse
)
import httpx
import base64
from app.features.body.body_repo import BodyRepository
from app.features.clothing.clothing_repo import ClothingRepository
from app.core.errors import NotFoundError, UnauthorizedError, InternalServerError
from app.core.pubsub_manager import pubsub_manager
from fastapi import WebSocket, WebSocketDisconnect

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
        if user.credits <= 0:
            raise UnauthorizedError("Insufficient credits to create a tryon")

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

    async def _publish_error(self, user_id: str, tryon_id: str, msg: str):
        await pubsub_manager.publish(
            user_id,
            {
                "type":     "tryon_update",
                "tryon_id": str(tryon_id),
                "status":   "failed",
                "error":    msg,
            }
        )

    async def _call_ia(self, user_id: str, body, tryon_id: str, clothing):
        """
        Génère le try-on via RunPod VTO endpoint avec polling
        """
        logger.info(f"🤖 [IA] Starting virtual try-on for body={body.id} × clothing={clothing.id}")
        
        try:
            # 1. Récupérer les URLs des images
            body_url = await self.storage.get_presigned_url(body.image_url)
            clothing_url = await self.storage.get_presigned_url(clothing.image_url)
            
            # 2. Déterminer le masque selon le type de vêtement
            mask_field_map = {
                "upper": "mask_upper",
                "lower": "mask_lower",
                "dress": "mask_dress",
            }
            mask_attr = mask_field_map.get(clothing.cloth_type)
            if not mask_attr:
                error_msg = f"No mask defined for cloth_type '{clothing.cloth_type}'"
                logger.error(f"🔴 [IA] {error_msg}")
                await self.repo.set_error(tryon_id, error_msg)
                await self._publish_error(user_id, tryon_id, error_msg)
                raise ValueError(error_msg)
            
            mask_key = getattr(body, mask_attr, None)
            if not mask_key:
                error_msg = f"Body has no attribute '{mask_attr}' or it's empty"
                logger.error(f"🔴 [IA] {error_msg}")
                await self.repo.set_error(tryon_id, error_msg)
                await self._publish_error(user_id, tryon_id, error_msg)
                raise ValueError(error_msg)
            
            mask_url = await self.storage.get_presigned_url(mask_key)
            
            # 3. Télécharger les images et les convertir en base64
            logger.info(f"📥 Téléchargement des images pour try-on...")
            person_base64 = await self._url_to_base64(body_url)
            cloth_base64 = await self._url_to_base64(clothing_url)
            mask_base64 = await self._url_to_base64(mask_url)
            
            # 4. Créer le job RunPod VTO
            logger.info(f"🚀 Création job RunPod VTO...")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Créer le job
                payload = {
                    "input": {
                        "person": person_base64,
                        "cloth": cloth_base64,
                        "mask": mask_base64,
                        "steps": 50,
                        "guidance_scale": 2.0,
                        "return_dict": True
                    }
                }
                
                headers = {
                    "Authorization": f"Bearer {settings.RUNPOD_API_KEY}",
                    "Content-Type": "application/json"
                }
                
                # Utiliser RUNPOD_API_URL (endpoint VTO)
                vto_endpoint = f"{settings.RUNPOD_API_URL}/run"
                
                logger.info(f"📡 POST {vto_endpoint}")
                response = await client.post(vto_endpoint, json=payload, headers=headers)
                
                if response.status_code != 200:
                    raise Exception(f"RunPod VTO error: {response.status_code} - {response.text}")
                
                job_data = response.json()
                job_id = job_data.get('id')
                
                if not job_id:
                    raise Exception(f"Pas de job_id dans réponse RunPod: {job_data}")
                
                logger.info(f"✅ Job RunPod créé: {job_id}")
                
                # 5. Polling du statut (comme dans test_new_backend)
                max_attempts = 60  # 10 minutes max (60 * 10s)
                attempt = 0
                
                while attempt < max_attempts:
                    await asyncio.sleep(10)  # Attendre 10 secondes
                    attempt += 1
                    
                    # Check status
                    status_url = f"{settings.RUNPOD_API_URL}/status/{job_id}"
                    status_response = await client.get(status_url, headers={"Authorization": f"Bearer {settings.RUNPOD_API_KEY}"})
                    
                    if status_response.status_code != 200:
                        logger.warning(f"⚠️ Erreur status check: {status_response.status_code}")
                        continue
                    
                    status_data = status_response.json()
                    status = status_data.get('status', '').upper()
                    
                    logger.info(f"📊 Job {job_id} status: {status} (attempt {attempt}/{max_attempts})")
                    
                    # Publier la progression
                    await pubsub_manager.publish(user_id, {
                        "type": "tryon_update",
                        "tryon_id": str(tryon_id),
                        "status": "processing",
                        "progress": min(50 + attempt * 0.8, 95)
                    })
                    
                    if status == 'COMPLETED':
                        # Extraire le résultat
                        output = status_data.get('output', {})
                        
                        # Parser selon la structure de test_new_backend
                        base64_image = None
                        if 'output' in output and isinstance(output['output'], dict):
                            base64_image = output['output'].get('output')
                        elif 'output' in output and isinstance(output['output'], str):
                            base64_image = output['output']
                        else:
                            base64_image = (
                                output.get('image_url') or
                                output.get('result_image') or
                                output.get('image') or
                                output.get('base64_image')
                            )
                        
                        if not base64_image:
                            raise Exception(f"Pas d'image dans output RunPod: {list(output.keys())}")
                        
                        logger.info(f"✅ [IA] RunPod generation completed successfully")
                        
                        # 6. Sauvegarder le résultat sur S3
                        s3_key = await self._save_result_to_s3(base64_image, user_id, str(tryon_id))
                        
                        # 7. Mise à jour MongoDB
                        await self.repo.set_tryon(tryon_id, s3_key)
                        
                        # 8. Publier succès via WebSocket
                        public_url = await self.storage.get_presigned_url(s3_key)
                        
                        await pubsub_manager.publish(
                            user_id,
                            {
                                "type": "tryon_update",
                                "tryon_id": str(tryon_id),
                                "body_id": str(body.id),
                                "clothing_id": str(clothing.id),
                                "status": "ready",
                                "output_url": public_url,
                                "created_at": datetime.now().isoformat(),
                                "version": 1,
                            }
                        )
                        
                        logger.info(f"✅ Try-on {tryon_id} completed: {s3_key}")
                        return
                        
                    elif status == 'FAILED':
                        error = status_data.get('error', 'Unknown error')
                        raise Exception(f"RunPod job failed: {error}")
                    
                    # Continue polling si IN_QUEUE ou IN_PROGRESS
                
                # Timeout
                raise Exception(f"Job {job_id} timeout après {max_attempts * 10}s")
                
        except Exception as e:
            msg = f"Échec génération IA: {e}"
            logger.exception(f"🔴 [IA] {msg}")
            await self.repo.set_error(tryon_id, msg)
            await self._publish_error(user_id, tryon_id, msg)
            raise InternalServerError(msg)

    async def _url_to_base64(self, url: str) -> str:
        """Convertir une URL en base64 data URL"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                image_data = response.content
                base64_data = base64.b64encode(image_data).decode('utf-8')
                # Déterminer le mime type
                content_type = response.headers.get('content-type', 'image/jpeg')
                return f"data:{content_type};base64,{base64_data}"
        except Exception as e:
            logger.error(f"❌ Erreur conversion URL to base64 {url}: {e}")
            raise

    async def _save_result_to_s3(self, base64_image: str, user_id: str, tryon_id: str) -> str:
        """Sauvegarder le résultat base64 sur S3 et retourner la clé"""
        try:
            # Extraire les données base64
            if base64_image.startswith('data:'):
                _, base64_data = base64_image.split(',', 1)
            else:
                base64_data = base64_image
            
            image_bytes = base64.b64decode(base64_data)
            
            # Créer la clé S3
            s3_key = StoragePathBuilder.tryon(user_id, tryon_id, tryon_id)
            
            # Upload sur S3
            await self.storage.upload_image(s3_key, image_bytes)
            
            logger.info(f"💾 Résultat try-on sauvegardé: {s3_key}")
            return s3_key
            
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde résultat S3: {e}")
            raise

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
                error=getattr(doc, 'error', None),
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
            error=getattr(doc, 'error', None),
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
    
    async def stream_tryon_ws(self, websocket: WebSocket, user_id: str):
        """
        Prend en charge une connexion WebSocket et push chaque événement
        try-on pour l'utilisateur donné.
        """
        # 1) Abonne l'utilisateur à son canal
        queue = pubsub_manager.subscribe(user_id)
        try:
            # 2) Tant que le client est connecté, on envoie les messages
            while True:
                data = await queue.get()           # ceci renvoie déjà une JSON string
                await websocket.send_text(data)    # on pousse texte pur
        except WebSocketDisconnect:
            # 3) Le client a fermé la connexion
            pass
        finally:
            # 4) Désabonnement propre
            pubsub_manager.unsubscribe(user_id, queue)

    async def get_tryons_by_body(
        self, body_id: str, user
    ) -> TryonListResponse:
        """
        Récupère tous les try-ons pour un body spécifique.
        """
        body = await self.body_repo.get_body_by_id(body_id)
        if not body or str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body")

        docs = await self.repo.get_all_by_body(body_id)
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
                error=getattr(doc, 'error', None),
                created_at=doc.created_at,
                version=doc.version
            ))
        return TryonListResponse(tryons=tryons)