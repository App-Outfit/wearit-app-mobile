import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
import aiohttp
from app.infrastructure.runpod.runpod_client import RunPodClient, RunPodError, RunPodTimeoutError


@pytest.fixture
def runpod_client():
    """Fixture pour créer un client RunPod de test"""
    return RunPodClient(
        api_url="https://api.runpod.ai/v2/test-endpoint",
        api_key="test-api-key",
        timeout=30
    )


@pytest.mark.asyncio
async def test_runpod_client_successful_inference(runpod_client):
    """Test d'une inférence réussie"""
    
    # Mock des réponses
    start_response = {"id": "test-job-123"}
    status_response_running = {"status": "IN_PROGRESS"}
    status_response_completed = {
        "status": "COMPLETED",
        "output": ["https://example.com/result.jpg"]
    }
    
    with patch('aiohttp.ClientSession') as mock_session:
        # Mock du contexte manager de session
        session_instance = AsyncMock()
        mock_session.return_value.__aenter__ = AsyncMock(return_value=session_instance)
        mock_session.return_value.__aexit__ = AsyncMock()
        
        # Mock des réponses HTTP
        mock_post_response = AsyncMock()
        mock_post_response.status = 200
        mock_post_response.json = AsyncMock(return_value=start_response)
        
        mock_get_response_running = AsyncMock()
        mock_get_response_running.status = 200
        mock_get_response_running.json = AsyncMock(return_value=status_response_running)
        
        mock_get_response_completed = AsyncMock()
        mock_get_response_completed.status = 200
        mock_get_response_completed.json = AsyncMock(return_value=status_response_completed)
        
        # Séquence des appels
        session_instance.post.return_value.__aenter__ = AsyncMock(return_value=mock_post_response)
        session_instance.post.return_value.__aexit__ = AsyncMock()
        
        session_instance.get.return_value.__aenter__ = AsyncMock(
            side_effect=[mock_get_response_running, mock_get_response_completed]
        )
        session_instance.get.return_value.__aexit__ = AsyncMock()
        
        # Test
        async with runpod_client:
            result = await runpod_client.run_inference({
                "person": "https://example.com/person.jpg",
                "cloth": "https://example.com/cloth.jpg",
                "mask": "https://example.com/mask.jpg"
            })
        
        assert result == "https://example.com/result.jpg"


@pytest.mark.asyncio
async def test_runpod_client_failed_job(runpod_client):
    """Test d'un job qui échoue"""
    
    start_response = {"id": "test-job-123"}
    status_response_failed = {
        "status": "FAILED",
        "error": "Model inference failed"
    }
    
    with patch('aiohttp.ClientSession') as mock_session:
        session_instance = AsyncMock()
        mock_session.return_value.__aenter__ = AsyncMock(return_value=session_instance)
        mock_session.return_value.__aexit__ = AsyncMock()
        
        mock_post_response = AsyncMock()
        mock_post_response.status = 200
        mock_post_response.json = AsyncMock(return_value=start_response)
        
        mock_get_response = AsyncMock()
        mock_get_response.status = 200
        mock_get_response.json = AsyncMock(return_value=status_response_failed)
        
        session_instance.post.return_value.__aenter__ = AsyncMock(return_value=mock_post_response)
        session_instance.post.return_value.__aexit__ = AsyncMock()
        session_instance.get.return_value.__aenter__ = AsyncMock(return_value=mock_get_response)
        session_instance.get.return_value.__aexit__ = AsyncMock()
        
        # Test
        async with runpod_client:
            with pytest.raises(RunPodError, match="Job test-job-123 failed: Model inference failed"):
                await runpod_client.run_inference({
                    "person": "https://example.com/person.jpg"
                })


@pytest.mark.asyncio
async def test_runpod_client_timeout():
    """Test du timeout"""
    
    # Client avec un timeout très court
    client = RunPodClient(
        api_url="https://api.runpod.ai/v2/test-endpoint",
        api_key="test-api-key",
        timeout=1  # 1 seconde
    )
    
    start_response = {"id": "test-job-123"}
    status_response_running = {"status": "IN_PROGRESS"}
    
    with patch('aiohttp.ClientSession') as mock_session:
        session_instance = AsyncMock()
        mock_session.return_value.__aenter__ = AsyncMock(return_value=session_instance)
        mock_session.return_value.__aexit__ = AsyncMock()
        
        mock_post_response = AsyncMock()
        mock_post_response.status = 200
        mock_post_response.json = AsyncMock(return_value=start_response)
        
        mock_get_response = AsyncMock()
        mock_get_response.status = 200
        mock_get_response.json = AsyncMock(return_value=status_response_running)
        
        session_instance.post.return_value.__aenter__ = AsyncMock(return_value=mock_post_response)
        session_instance.post.return_value.__aexit__ = AsyncMock()
        session_instance.get.return_value.__aenter__ = AsyncMock(return_value=mock_get_response)
        session_instance.get.return_value.__aexit__ = AsyncMock()
        
        # Test
        async with client:
            with pytest.raises(RunPodTimeoutError, match="Job test-job-123 timed out after 1s"):
                await client.run_inference({
                    "person": "https://example.com/person.jpg"
                })


@pytest.mark.asyncio
async def test_runpod_client_network_error(runpod_client):
    """Test des erreurs réseau"""
    
    with patch('aiohttp.ClientSession') as mock_session:
        session_instance = AsyncMock()
        mock_session.return_value.__aenter__ = AsyncMock(return_value=session_instance)
        mock_session.return_value.__aexit__ = AsyncMock()
        
        # Simuler une erreur réseau
        session_instance.post.side_effect = aiohttp.ClientError("Network error")
        
        # Test
        async with runpod_client:
            with pytest.raises(RunPodError, match="Network error"):
                await runpod_client.run_inference({
                    "person": "https://example.com/person.jpg"
                })


@pytest.mark.asyncio
async def test_runpod_client_invalid_response_format(runpod_client):
    """Test de format de réponse invalide"""
    
    start_response = {"id": "test-job-123"}
    status_response_completed = {
        "status": "COMPLETED",
        "output": None  # Output invalide
    }
    
    with patch('aiohttp.ClientSession') as mock_session:
        session_instance = AsyncMock()
        mock_session.return_value.__aenter__ = AsyncMock(return_value=session_instance)
        mock_session.return_value.__aexit__ = AsyncMock()
        
        mock_post_response = AsyncMock()
        mock_post_response.status = 200
        mock_post_response.json = AsyncMock(return_value=start_response)
        
        mock_get_response = AsyncMock()
        mock_get_response.status = 200
        mock_get_response.json = AsyncMock(return_value=status_response_completed)
        
        session_instance.post.return_value.__aenter__ = AsyncMock(return_value=mock_post_response)
        session_instance.post.return_value.__aexit__ = AsyncMock()
        session_instance.get.return_value.__aenter__ = AsyncMock(return_value=mock_get_response)
        session_instance.get.return_value.__aexit__ = AsyncMock()
        
        # Test
        async with runpod_client:
            with pytest.raises(RunPodError, match="Job test-job-123 completed but no output"):
                await runpod_client.run_inference({
                    "person": "https://example.com/person.jpg"
                })