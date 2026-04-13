from pydantic import BaseModel
from typing import Literal


class OrderBase(BaseModel):
    id:       str
    customer: str
    amount:   float
    status:   Literal["completed", "pending", "refunded"]
    date:     str


class OrderResponse(OrderBase):
    class Config:
        from_attributes = True