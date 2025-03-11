from sqlalchemy import Column, String, UUID, ForeignKey, TIMESTAMP, func, ARRAY
from sqlalchemy.orm import relationship
from app.infrastructure.database.models.base import Base
import uuid

class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    outfit_image_url = Column(String, nullable=False)
    clothes_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())

    # Relations
    user = relationship("User", back_populates="outfits")