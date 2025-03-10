from sqlalchemy import Column, String, UUID, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class TryOnHistory(Base):
    __tablename__ = "tryon_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body_image_id = Column(UUID(as_uuid=True), ForeignKey("body_images.id", ondelete="CASCADE"), nullable=False)
    cloth_id = Column(UUID(as_uuid=True), ForeignKey("clothes.id", ondelete="CASCADE"), nullable=False)
    tryon_image_url = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())

    # Relations
    user = relationship("User", back_populates="tryon_history")
    body_image = relationship("BodyImage")
    cloth = relationship("Cloth", back_populates="tryon_history")
