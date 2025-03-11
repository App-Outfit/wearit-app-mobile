from sqlalchemy import Column, String, UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    body_images = relationship("BodyImage", back_populates="user", cascade="all, delete-orphan")
    clothes = relationship("Cloth", back_populates="user", cascade="all, delete-orphan")
    tryon_history = relationship("TryOnHistory", back_populates="user", cascade="all, delete-orphan")
    outfits = relationship("Outfit", back_populates="user", cascade="all, delete-orphan")
