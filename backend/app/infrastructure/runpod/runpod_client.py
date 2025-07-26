import aiohttp
import asyncio
import time
from typing import Dict, Any, Optional
from app.core.logging_config import logger
from app.core.config import settings


class RunPodError(Exception):
    """Exception levée lors d'erreurs avec l'API RunPod"""
    pass


class RunPodTimeoutError(RunPodError):
    """Exception levée lors d'un timeout RunPod"""
    pass


class RunPodClient:
    """Client pour interagir avec l'API RunPod"""
    
    def __init__(self, api_url: str, api_key: str, timeout: int = 300):
        self.api_url = api_url.rstrip('/')
        self.api_key = api_key
        self.timeout = timeout
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            timeout=aiohttp.ClientTimeout(total=self.timeout)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def run_inference(self, input_data: Dict[str, Any], upload_files: bool = False) -> str:
        """
        Lance une inférence sur RunPod et attend le résultat
        
        Args:
            input_data: Données d'entrée pour le modèle
            upload_files: Si True, upload les fichiers vers RunPod. Si False, utilise les URLs directement.
            
        Returns:
            URL de l'image générée
            
        Raises:
            RunPodError: En cas d'erreur de l'API
            RunPodTimeoutError: En cas de timeout
        """
        if not self.session:
            raise RunPodError("Client not initialized. Use async context manager.")
        
        try:
            # 1. Préparer les données d'entrée
            if upload_files:
                prepared_input = await self._upload_files(input_data)
            else:
                prepared_input = input_data
            
            # 2. Lancer l'inférence
            logger.info(f"🤖 [RunPod] Starting inference with input keys: {list(prepared_input.keys())}")
            job_id = await self._start_inference(prepared_input)
            
            # 3. Attendre le résultat
            logger.info(f"🤖 [RunPod] Job started with ID: {job_id}")
            result = await self._wait_for_result(job_id)
            
            return result
            
        except aiohttp.ClientError as e:
            logger.error(f"🔴 [RunPod] Network error: {e}")
            raise RunPodError(f"Network error: {e}")
        except asyncio.TimeoutError:
            logger.error(f"🔴 [RunPod] Timeout after {self.timeout}s")
            raise RunPodTimeoutError(f"Request timed out after {self.timeout}s")
    
    async def _upload_files(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Upload les fichiers vers RunPod et retourne les données d'entrée modifiées
        
        Note: Cette méthode devra être implémentée selon l'API d'upload de RunPod
        """
        prepared_input = input_data.copy()
        
        # Fichiers à uploader (URLs HTTP vers chemins de fichiers)
        file_fields = ['person', 'cloth', 'mask']
        
        for field in file_fields:
            if field in input_data and isinstance(input_data[field], str):
                url = input_data[field]
                if url.startswith('http'):
                    # Télécharger le fichier et l'uploader vers RunPod
                    file_path = await self._download_and_upload_file(url, field)
                    prepared_input[field] = file_path
        
        return prepared_input
    
    async def _download_and_upload_file(self, url: str, field_name: str) -> str:
        """
        Télécharge un fichier depuis une URL et l'upload vers RunPod
        
        Returns:
            Chemin du fichier sur RunPod (ex: file:///workspace/uploaded_file.jpg)
        """
        try:
            # 1. Télécharger le fichier
            async with self.session.get(url) as response:
                if response.status != 200:
                    raise RunPodError(f"Failed to download {field_name} from {url}: {response.status}")
                
                file_content = await response.read()
                logger.info(f"🤖 [RunPod] Downloaded {field_name} ({len(file_content)} bytes)")
            
            # 2. Upload vers RunPod (à adapter selon l'API RunPod)
            # Pour l'instant, nous supposons que RunPod peut télécharger directement les URLs HTTP
            # Si un upload séparé est nécessaire, cette méthode devra être modifiée
            
            # TODO: Implémenter l'upload réel vers RunPod
            # Exemple d'API d'upload :
            # upload_data = aiohttp.FormData()
            # upload_data.add_field('file', file_content, filename=f'{field_name}.jpg', content_type='image/jpeg')
            # async with self.session.post(f"{self.api_url}/upload", data=upload_data) as response:
            #     upload_result = await response.json()
            #     return upload_result['file_path']
            
            # Pour l'instant, on retourne l'URL originale
            # RunPod devrait pouvoir télécharger les URLs HTTP directement
            return url
            
        except Exception as e:
            logger.error(f"🔴 [RunPod] Failed to upload {field_name}: {e}")
            raise RunPodError(f"Failed to upload {field_name}: {e}")
    
    async def _start_inference(self, input_data: Dict[str, Any]) -> str:
        """Lance une inférence et retourne le job ID"""
        
        payload = {
            "input": input_data,
            "webhook": None  # Pas de webhook pour l'instant
        }
        
        # Si l'URL se termine déjà par /run, ne pas l'ajouter
        if self.api_url.endswith('/run'):
            endpoint_url = self.api_url
        else:
            endpoint_url = f"{self.api_url}/run"
            
        async with self.session.post(endpoint_url, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                logger.error(f"🔴 [RunPod] Failed to start inference: {response.status} - {error_text}")
                raise RunPodError(f"Failed to start inference: {response.status} - {error_text}")
            
            data = await response.json()
            
            if "id" not in data:
                logger.error(f"🔴 [RunPod] No job ID in response: {data}")
                raise RunPodError("No job ID in response")
            
            return data["id"]
    
    async def _wait_for_result(self, job_id: str) -> str:
        """Attend le résultat d'une inférence en polling"""
        
        start_time = time.time()
        poll_interval = 2  # Commencer avec 2 secondes
        max_poll_interval = 10  # Maximum 10 secondes
        
        while True:
            elapsed = time.time() - start_time
            
            # Vérifier le timeout
            if elapsed > self.timeout:
                logger.error(f"🔴 [RunPod] Timeout waiting for job {job_id}")
                raise RunPodTimeoutError(f"Job {job_id} timed out after {self.timeout}s")
            
            # Vérifier le statut du job
            try:
                # Pour le status, utiliser l'URL de base sans /run
                base_url = self.api_url.replace('/run', '') if self.api_url.endswith('/run') else self.api_url
                status_url = f"{base_url}/status/{job_id}"
                
                logger.info(f"🔍 [RunPod] Checking status at: {status_url}")
                
                async with self.session.get(status_url) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.warning(f"🟡 [RunPod] Status check failed: {response.status} - {error_text}")
                        await asyncio.sleep(poll_interval)
                        continue
                    
                    data = await response.json()
                    status = data.get("status")
                    
                    logger.info(f"🤖 [RunPod] Job {job_id} status: {status} (elapsed: {elapsed:.1f}s)")
                    # logger.info(f"🔍 [RunPod] Full response data: {data}")  # Commenté pour éviter spam
                    
                    if status == "COMPLETED":
                        logger.info(f"🎉 [RunPod] Job {job_id} is COMPLETED! Processing output...")
                        try:
                            # Job terminé avec succès
                            output = data.get("output")
                            logger.info(f"🔍 [RunPod] Job {job_id} completed. Output type: {type(output)}")
                            # logger.info(f"🔍 [RunPod] Raw output: {output}")  # Commenté pour éviter spam
                            
                            if not output:
                                raise RunPodError(f"Job {job_id} completed but no output")
                            
                            # Extraire l'URL de l'image (format peut varier selon le modèle)
                            result_url = None
                            if isinstance(output, list) and len(output) > 0:
                                result_url = output[0]
                                logger.info(f"🔍 [RunPod] Extracted from list[0]")
                            elif isinstance(output, dict):
                                # Essayer plusieurs clés possibles pour return_dict: true
                                logger.info(f"🔍 [RunPod] Output keys: {list(output.keys())}")
                                
                                # Cas spécial : si output contient une clé 'output', regarder dedans
                                if 'output' in output:
                                    inner_output = output['output']
                                    logger.info(f"🔍 [RunPod] Found nested output, type: {type(inner_output)}")
                                    
                                    if isinstance(inner_output, list) and len(inner_output) > 0:
                                        result_url = inner_output[0]
                                    elif isinstance(inner_output, dict):
                                        result_url = (
                                            inner_output.get("image_url") or 
                                            inner_output.get("output_url") or 
                                            inner_output.get("url") or
                                            inner_output.get("image") or
                                            inner_output.get("result") or
                                            inner_output.get("generated_image")
                                        )
                                    else:
                                        result_url = str(inner_output)
                                else:
                                    # Cas normal : chercher directement dans output
                                    result_url = (
                                        output.get("image_url") or 
                                        output.get("output_url") or 
                                        output.get("url") or
                                        output.get("image") or
                                        output.get("result") or
                                        output.get("generated_image")
                                    )
                                
                                logger.info(f"🔍 [RunPod] Extracted from dict successfully")
                            else:
                                result_url = str(output)
                                logger.info(f"🔍 [RunPod] Converted to string")
                            
                            if not result_url:
                                logger.error(f"🔴 [RunPod] Could not extract result URL from output")
                                raise RunPodError(f"Could not extract result URL from output")
                            
                            url_type = "data:image" if result_url.startswith("data:image") else "http" if result_url.startswith("http") else "other"
                            logger.info(f"✅ [RunPod] Job {job_id} completed successfully. URL type: {url_type}, length: {len(result_url)}")
                            return result_url
                        except Exception as e:
                            logger.error(f"🔴 [RunPod] Exception while processing COMPLETED job: {e}")
                            logger.exception("Full exception details:")
                            raise
                    
                    elif status == "FAILED":
                        error_msg = data.get("error", "Unknown error")
                        logger.error(f"🔴 [RunPod] Job {job_id} failed: {error_msg}")
                        raise RunPodError(f"Job {job_id} failed: {error_msg}")
                    
                    elif status in ["IN_QUEUE", "IN_PROGRESS", "RUNNING"]:
                        # Job en cours, continuer à attendre
                        await asyncio.sleep(poll_interval)
                        
                        # Augmenter progressivement l'intervalle de polling
                        poll_interval = min(poll_interval * 1.2, max_poll_interval)
                        continue
                    
                    else:
                        logger.warning(f"🟡 [RunPod] Unknown status for job {job_id}: {status}")
                        await asyncio.sleep(poll_interval)
                        continue
                        
            except aiohttp.ClientError as e:
                logger.warning(f"🟡 [RunPod] Error checking status for job {job_id}: {e}")
                await asyncio.sleep(poll_interval)
                continue


def create_runpod_client() -> RunPodClient:
    """Factory function pour créer un client RunPod configuré"""
    
    api_url = getattr(settings, 'RUNPOD_API_URL', None)
    api_key = getattr(settings, 'RUNPOD_API_KEY', None)
    timeout = getattr(settings, 'RUNPOD_TIMEOUT', 300)
    
    if not api_url:
        raise RunPodError("RUNPOD_API_URL not configured")
    
    if not api_key:
        raise RunPodError("RUNPOD_API_KEY not configured")
    
    return RunPodClient(api_url, api_key, timeout)