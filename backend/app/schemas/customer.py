from pydantic import BaseModel
from typing import Literal


class CustomerBase(BaseModel):
    id:          str
    name:        str
    email:       str
    country:     str
    total_spend: float
    orders:      int
    last_order:  str
    status:      Literal["active", "at-risk", "churned"]


class CustomerResponse(CustomerBase):
    class Config:
        from_attributes = True