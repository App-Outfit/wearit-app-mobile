from sqlalchemy import Column, String, UUID, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class BodyMasks(Base):
    __tablename__ = "body_masks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    body_id = Column(UUID(as_uuid=True), ForeignKey("body_images.id", ondelete="CASCADE"), nullable=False)
    mask_upper = Column(String, nullable=False)
    mask_lower = Column(String, nullable=False)
    mask_overall = Column(String, nullable=False)

    # Relations
    body_image = relationship("BodyImage", back_populates="body_masks")
