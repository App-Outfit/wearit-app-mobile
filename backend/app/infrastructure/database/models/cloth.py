from sqlalchemy import Column, String, UUID, ForeignKey, Boolean, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class Cloth(Base):
    __tablename__ = "clothes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    name = Column(String, nullable=True)
    type = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())

    # Relations
    user = relationship("User", back_populates="clothes")
    tryon_history = relationship("TryOnHistory", back_populates="cloth")
