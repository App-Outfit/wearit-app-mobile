from sqlalchemy import Column, String, UUID, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class BodyImage(Base):
    __tablename__ = "body_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())

    # Relations
    user = relationship("User", back_populates="body_images")
    body_masks = relationship("BodyMasks", back_populates="body_image")
