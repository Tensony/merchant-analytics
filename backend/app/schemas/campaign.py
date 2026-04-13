from pydantic import BaseModel
from typing import Literal


class CampaignBase(BaseModel):
    id:          str
    name:        str
    channel:     Literal["email", "paid", "social", "sms"]
    status:      Literal["active", "paused", "completed"]
    budget:      float
    spent:       float
    impressions: int
    clicks:      int
    conversions: int
    revenue:     float
    start_date:  str
    end_date:    str


class CampaignResponse(CampaignBase):
    class Config:
        from_attributes = True