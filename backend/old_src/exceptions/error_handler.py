from functools import wraps
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

def handle_errors(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HTTPException as e:
            logger.error(f"HTTPException: {e.detail}")
            raise e
        except Exception as e:
            logger.exception("Unexpected error")
            raise HTTPException(status_code=500, detail="Internal server error")
    return wrapper
