from typing import List
from bson import ObjectId
from pydantic import BaseModel, Field, field_serializer
from datetime import datetime


class FavoriteInDB(BaseModel):
    id: ObjectId = Field(alias="_id")
    user_id: ObjectId
    body_id: ObjectId
    clothing_ids: List[ObjectId]
    created_at: datetime
    updated_at: datetime

    @field_serializer("id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True
    }