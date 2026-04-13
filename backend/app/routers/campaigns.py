from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.campaign import Campaign
from app.schemas.campaign import CampaignResponse

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.get("/", response_model=List[CampaignResponse])
def get_campaigns(
    status:  Optional[str] = Query(None),
    channel: Optional[str] = Query(None),
    db:      Session       = Depends(get_db),
):
    query = db.query(Campaign)

    if status:
        query = query.filter(Campaign.status == status)

    if channel:
        query = query.filter(Campaign.channel == channel)

    return query.all()