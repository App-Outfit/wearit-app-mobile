from pydantic import BaseModel, Field, field_serializer
from bson import ObjectId
from typing import Optional, Literal
from datetime import datetime

class PaymentInDB(BaseModel):
    id: ObjectId = Field(alias="_id")
    user_id: ObjectId
    stripe_session_id: str
    type: Literal["credits", "subscription"]
    amount: int  # en centimes
    credits_added: Optional[int] = None
    subscription_type: Optional[Literal["weekly", "monthly"]] = None
    status: Literal["pending", "paid", "failed"]
    created_at: datetime
    updated_at: datetime

    @field_serializer("id")
    def serialize_object_ids(self, v: ObjectId, _info):
        return str(v)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True
    }