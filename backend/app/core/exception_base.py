from abc import ABC, abstractmethod

class BaseCustomException(ABC, Exception):
    status_code: int = 500

    @property
    @abstractmethod
    def message(self) -> str:
        pass

    @property
    @abstractmethod
    def trace(self) -> str:
        pass
