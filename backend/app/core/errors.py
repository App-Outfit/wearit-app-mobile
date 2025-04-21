class AppError(Exception):
    def __init__(self, message: str, *, status_code: int, error_code: str):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

class ConflictError(AppError):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, status_code=409, error_code="conflict")

class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404, error_code="not_found")

class ValidationError(AppError):
    def __init__(self, message: str = "Invalid input data"):
        super().__init__(message, status_code=400, error_code="validation_error")

class UnauthorizedError(AppError):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401, error_code="unauthorized")

class InternalServerError(AppError):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(message, status_code=500, error_code="internal_error")