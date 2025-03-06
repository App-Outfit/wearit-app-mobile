from fastapi import HTTPException

class ConflictError(HTTPException):
    def __init__(self, detail="Resource already exists"):
        super().__init__(status_code=409, detail=detail)

class NotFoundError(HTTPException):
    def __init__(self, detail="Resource not found"):
        super().__init__(status_code=404, detail=detail)

class ValidationError(HTTPException):
    def __init__(self, detail="Invalid input data"):
        super().__init__(status_code=400, detail=detail)

class UnauthorizedError(HTTPException):
    def __init__(self, detail="Unauthorized"):
        super().__init__(status_code=401, detail=detail)

class InternalServerError(HTTPException):
    def __init__(self, detail="Internal server error"):
        super().__init__(status_code=500, detail=detail)
