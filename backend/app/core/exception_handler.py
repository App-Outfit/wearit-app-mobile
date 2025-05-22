import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .exception_base import BaseCustomException
from .logging_config import logger

async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, BaseCustomException):
        logger.error(exc.trace)
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": exc.__class__.__name__.lower(),
                "message": exc.message
            },
        )

    elif isinstance(exc, RequestValidationError):
        logger.warning(f"🔶 Validation error: {exc.errors()}")
        return JSONResponse(
            status_code=400,
            content={
                "error_code": "validation_error",
                "message": "Invalid request payload",
                "details": exc.errors()
            },
        )

    elif isinstance(exc, StarletteHTTPException):
        logger.warning(f"🔷 HTTP error: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": "http_error",
                "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            },
        )

    logger.exception("🔴 Unhandled internal error")
    return JSONResponse(
        status_code=500,
        content={
            "error_code": "internal_error",
            "message": "Unexpected internal server error"
        },
    )
