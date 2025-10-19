from bson import ObjectId
import asyncio
from fastapi import UploadFile, WebSocket, WebSocketDisconnect
from app.core.logging_config import logger
from .body_repo import BodyRepository
from app.core.pubsub_manager import pubsub_manager
from datetime import datetime
from .body_schema import (
    BodyUploadResponse, BodyListResponse, BodyItem, BodyMasksResponse
)
from app.infrastructure.storage.storage_repo import StorageRepository
from app.infrastructure.storage.storage_path_builder import StoragePathBuilder
from app.core.errors import NotFoundError, UnauthorizedError
from app.core.config import settings
import base64
import httpx
from app.infrastructure.gemini.gemini_service import GeminiService

# Prompt for Gemini enhancement
DEFAULT_STUDIO_PROMPT = (
    "Generate a full-body color fashion editorial photograph of the person in the source image. "
    "Keep the person's original face, body type, and height. The mannequin is wearing a form-fitting, plain black short-sleeved top and sleek, close-fitting black trousers "
    "The subject stands upright in a full-frontal pose, facing the camera directly. The body is "
    "symmetrical, arms relaxed along the sides, with both CLEARLY VISIBLE and natural. Legs are "
    "straight, feet pointing forward, positioned close together but not overlapping. "
    "The head is straight, the expression calm and confident, eyes looking directly at the camera. "
    "The composition is centered, with the subject perfectly aligned along the vertical axis of the "
    "frame, on a clean white background. Lighting is soft, evenly diffused, and shadow-free. "
    "No text. No additional accessories. Keep the person's glasses only if originally worn."
)

class BodyService:
    def __init__(self, repo: BodyRepository, storage: StorageRepository = None):
        self.repo = repo
        self.storage = storage or StorageRepository()

    # ✅ Upload + Preprocessing
    async def upload_body(self, user, image: UploadFile) -> BodyUploadResponse:
        logger.info(f"📤 Upload body for user {user.id}")

        body_id = ObjectId()
        body_id_str = str(body_id)

        # Génère le chemin S3 pour l'original
        object_key = StoragePathBuilder.body_original(user.id, body_id_str)

        # Upload sur S3
        await self.storage.upload_image(object_key, image)

        # Enregistre l'objet (on garde juste le chemin S3, pas l'URL directe)
        body = await self.repo.create_body(
            user_id=user.id,
            body_id=body_id,
            image_url=object_key
        )

        # Lance preprocessing async
        asyncio.create_task(self._body_preprocessing(user.id, body))

        return BodyUploadResponse(
            body_id=body_id_str,
            status="pending",
            message="Body uploaded. Preprocessing started."
        )
    
    async def _publish_error(self, user_id: str, body_id: str, msg: str):
        await pubsub_manager.publish(
            user_id,
            {
                "type": "body_preprocessing",
                "body_id": str(body_id),
                "status": "failed",
                "error": msg,
            }
        )

    async def _body_preprocessing(self, user_id: str, body):
        """
        Prétraiter le body : amélioration Gemini + génération masks via RunPod preprocessing
        """
        logger.info(f"🧪 [IA] Starting preprocessing for body={body.id}")

        body_id = str(body.id)
        original_key = body.image_url

        try:
            # 1. Télécharger l'image depuis S3
            logger.info(f"📥 Téléchargement image body depuis S3: {original_key}")
            image_data = await self.storage.get_file(original_key)
            
            # Convertir bytes en base64 data URL
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            image_data_url = f"data:image/jpeg;base64,{image_base64}"
            
            # 2. Amélioration de l'image avec Gemini (si activé)
            enhanced_image_data_url = image_data_url
            if settings.USE_GEMINI_ENHANCEMENT:
                try:
                    logger.info(f"✨ Amélioration image body via Gemini pour body={body_id}")
                    await pubsub_manager.publish(user_id, {
                        "type": "body_preprocessing",
                        "body_id": str(body_id),
                        "status": "processing",
                        "step": "gemini_enhancement",
                        "message": "Amélioration de l'image..."
                    })
                    
                    gemini_service = GeminiService()
                    enhanced_image_data_url = await gemini_service.enhance_person_image(
                        image_data_url,
                        DEFAULT_STUDIO_PROMPT
                    )
                    logger.info(f"✅ Image body améliorée via Gemini")
                    
                    # Upload de l'image améliorée sur S3 (remplacer l'originale)
                    if enhanced_image_data_url.startswith('data:'):
                        # Extraire les données base64
                        _, base64_data = enhanced_image_data_url.split(',', 1)
                        enhanced_image_bytes = base64.b64decode(base64_data)
                        
                        # Upload sur S3 (écrase l'ancienne image)
                        await self.storage.upload_image(original_key, enhanced_image_bytes)
                        logger.info(f"💾 Image améliorée sauvegardée sur S3: {original_key}")
                        
                except Exception as gemini_error:
                    logger.warning(f"⚠️ Échec amélioration Gemini (continue sans): {gemini_error}")
                    # Continue avec l'image originale si Gemini échoue
                    enhanced_image_data_url = image_data_url
            else:
                logger.info(f"ℹ️ Amélioration Gemini désactivée (USE_GEMINI_ENHANCEMENT=false)")
            
            # 3. Génération des masques via RunPod preprocessing
            logger.info(f"🎭 Génération masques via RunPod preprocessing pour body={body_id}")
            await pubsub_manager.publish(user_id, {
                "type": "body_preprocessing",
                "body_id": str(body_id),
                "status": "processing",
                "step": "mask_generation",
                "message": "Génération des masques..."
            })
            
            # Appel RunPod preprocessing
            mask_images, resized_image = await self._generate_masks_runpod(enhanced_image_data_url)
            
            # 4. Upload des masques sur S3
            logger.info(f"💾 Upload des masques sur S3 pour body={body_id}")
            
            # Utiliser l'image redimensionnée si disponible
            if resized_image:
                logger.info(f"📐 Utilisation image redimensionnée par RunPod pour le body")
                # Upload l'image redimensionnée (remplace l'image actuelle)
                await self.storage.upload_image(original_key, resized_image)
            
            # Upload masques
            s3_masks = {}
            
            # Upper mask
            if "upper" in mask_images:
                upper_mask_key = StoragePathBuilder.body_mask(user_id, body_id, "upper")
                await self.storage.upload_image(upper_mask_key, mask_images["upper"])
                s3_masks["mask_upper"] = upper_mask_key
                logger.info(f"✅ Upper mask uploadé: {upper_mask_key}")
            
            # Lower mask
            if "lower" in mask_images:
                lower_mask_key = StoragePathBuilder.body_mask(user_id, body_id, "lower")
                await self.storage.upload_image(lower_mask_key, mask_images["lower"])
                s3_masks["mask_lower"] = lower_mask_key
                logger.info(f"✅ Lower mask uploadé: {lower_mask_key}")
            
            # Dress/Overall mask
            if "overall" in mask_images:
                dress_mask_key = StoragePathBuilder.body_mask(user_id, body_id, "dress")
                await self.storage.upload_image(dress_mask_key, mask_images["overall"])
                s3_masks["mask_dress"] = dress_mask_key
                logger.info(f"✅ Dress/Overall mask uploadé: {dress_mask_key}")
            
            # 5. Mise à jour DB (image_url et masks)
            await self.repo.update_body_image_url(body_id, original_key)
            await self.repo.set_masks(body_id, s3_masks)
            logger.info(f"✅ [IA] Body preprocessing done for {body_id}")
            
            # 6. Génère URLs signées pour le front
            presigned_original = await self.storage.get_presigned_url(original_key)
            presigned_masks = {
                field: await self.storage.get_presigned_url(key)
                for field, key in s3_masks.items()
            }
            
            # 7. WebSocket pour prévenir le front
            await pubsub_manager.publish(
                user_id,
                {
                    "type": "body_preprocessing",
                    "body_id": body_id,
                    "status": "ready",
                    "original": presigned_original,
                    "masks": presigned_masks,
                    "created_at": datetime.now().isoformat(),
                }
            )
            logger.info(f"✅ [IA] WebSocket published for body {body_id}")

        except Exception as e:
            msg = f"Échec du preprocessing IA : {e}"
            logger.exception(msg)
            await self.repo.set_error(body_id, msg)
            await self._publish_error(user_id, body_id, msg)

    async def _generate_masks_runpod(self, image_data_url: str) -> tuple[dict, bytes]:
        """
        Génère les masques via RunPod preprocessing endpoint
        
        Returns:
            Tuple[dict, bytes]: (mask_images, resized_image)
            - mask_images: {"upper": bytes, "lower": bytes, "overall": bytes}
            - resized_image: Image redimensionnée (bytes) ou None
        """
        try:
            if not settings.RUNPOD_API_KEY or not settings.RUNPOD_PREPROCESSING_ENDPOINT:
                raise ValueError("RunPod preprocessing endpoint non configuré")
            
            # Payload pour RunPod
            payload = {
                "input": {
                    "person": image_data_url
                }
            }
            
            headers = {
                "Authorization": f"Bearer {settings.RUNPOD_API_KEY}",
                "Content-Type": "application/json"
            }
            
            logger.info(f"📡 Envoi requête RunPod preprocessing...")
            
            async with httpx.AsyncClient(timeout=600.0) as client:
                response = await client.post(
                    settings.RUNPOD_PREPROCESSING_ENDPOINT,
                    json=payload,
                    headers=headers
                )
                
                if response.status_code != 200:
                    raise Exception(f"RunPod preprocessing error: {response.status_code} - {response.text}")
                
                result = response.json()
                
                # Parse la réponse selon la structure de test_new_backend
                if "output" not in result:
                    raise Exception(f"Réponse RunPod invalide: {result}")
                
                output_data = result["output"]["output"]
                output_masks = output_data["masks"]
                
                logger.info(f"✅ RunPod preprocessing - Masques: {list(output_masks.keys())}")
                
                # Extraire l'image redimensionnée
                resized_image = None
                if "resized" in output_data:
                    resized_base64 = output_data["resized"]
                    if resized_base64.startswith('data:'):
                        _, base64_data = resized_base64.split(',', 1)
                    else:
                        base64_data = resized_base64
                    resized_image = base64.b64decode(base64_data)
                    logger.info(f"📐 Image redimensionnée récupérée depuis RunPod")
                
                # Extraire les masques
                mask_images = {}
                
                if "upper" in output_masks:
                    upper_base64 = output_masks["upper"]
                    if upper_base64.startswith('data:'):
                        _, base64_data = upper_base64.split(',', 1)
                    else:
                        base64_data = upper_base64
                    mask_images["upper"] = base64.b64decode(base64_data)
                else:
                    raise Exception("Masque upper manquant")
                
                if "lower" in output_masks:
                    lower_base64 = output_masks["lower"]
                    if lower_base64.startswith('data:'):
                        _, base64_data = lower_base64.split(',', 1)
                    else:
                        base64_data = lower_base64
                    mask_images["lower"] = base64.b64decode(base64_data)
                else:
                    raise Exception("Masque lower manquant")
                
                if "dress" in output_masks:
                    dress_base64 = output_masks["dress"]
                    if dress_base64.startswith('data:'):
                        _, base64_data = dress_base64.split(',', 1)
                    else:
                        base64_data = dress_base64
                    mask_images["overall"] = base64.b64decode(base64_data)
                else:
                    raise Exception("Masque dress/overall manquant")
                
                logger.info(f"✅ Tous les masques extraits avec succès")
                return mask_images, resized_image
                
        except Exception as e:
            logger.error(f"❌ Erreur génération masques RunPod: {e}")
            raise


    # ✅ Liste des bodies
    async def get_all_bodies(self, user) -> BodyListResponse:
        bodies = await self.repo.get_all_bodies(user.id)
        response_items = []

        for b in bodies:
            presigned_url = await self.storage.get_presigned_url(b.image_url)
            response_items.append(BodyItem(
                id=str(b.id),
                image_url=presigned_url,
                status=b.status,
                is_default=b.is_default,
                created_at=b.created_at
            ))

        return BodyListResponse(bodies=response_items)

    # ✅ Dernier body actif (latest)
    async def get_latest_body(self, user) -> BodyItem:
        body = await self.repo.get_latest_body(user.id)
        if not body:
            raise NotFoundError("No body found.")

        # Générer les URLs signées uniquement si les champs existent
        mask_upper_url = await self.storage.get_presigned_url(body.mask_upper) if body.mask_upper else None
        mask_lower_url = await self.storage.get_presigned_url(body.mask_lower) if body.mask_lower else None
        mask_dress_url = await self.storage.get_presigned_url(body.mask_dress) if body.mask_dress else None
        original_url = await self.storage.get_presigned_url(body.image_url) if body.image_url else None
        
        return BodyItem(
            id=str(body.id),
            image_url=original_url,
            mask_upper=mask_upper_url,
            mask_lower=mask_lower_url,
            mask_dress=mask_dress_url,
            status=body.status,
            is_default=body.is_default,
            created_at=body.created_at
        )

    # ✅ Masques du body + image originale
    async def get_masks(self, body_id: str, user) -> BodyMasksResponse:
        body = await self.repo.get_body_by_id(body_id)
        if str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body.")

        mask_upper_url = await self.storage.get_presigned_url(body.mask_upper)
        mask_lower_url = await self.storage.get_presigned_url(body.mask_lower)
        mask_dress_url = await self.storage.get_presigned_url(body.mask_dress)
        original_url = await self.storage.get_presigned_url(body.image_url)

        return BodyMasksResponse(
            original=original_url,
            mask_upper=mask_upper_url,
            mask_lower=mask_lower_url,
            mask_dress=mask_dress_url
        )

    # ✅ Suppression d’un body
    async def delete_body(self, body_id: str, user):
        body = await self.repo.get_body_by_id(body_id)
        if str(body.user_id) != str(user.id):
            raise UnauthorizedError("You do not own this body.")

        # Supprime image originale
        await self.storage.delete_image(body.image_url)

        # Supprime masques s'ils existent
        for key in [body.mask_upper, body.mask_lower, body.mask_dress]:
            if key:
                await self.storage.delete_image(key)

        await self.repo.delete_body(body_id)

        logger.info(f"🗑️ Deleted body {body_id} for user {user.id}")
        return {"message": "Body deleted"}
    
    async def stream_body_ws(self, websocket: WebSocket, user_id: str):
        """
        Prend en charge une connexion WebSocket et push chaque événement
        de prétraitement de body pour l'utilisateur donné.
        """
        # 1) Abonne l'utilisateur à son canal
        queue = pubsub_manager.subscribe(user_id)
        try:
            # 2) Tant que le client est connecté, on envoie les messages
            while True:
                data = await queue.get()           # JSON string depuis le manager
                await websocket.send_text(data)
        except WebSocketDisconnect:
            # 3) Le client a fermé la connexion
            pass
        finally:
            # 4) Désabonnement propre
            pubsub_manager.unsubscribe(user_id, queue)