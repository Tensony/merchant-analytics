from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderResponse

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("/", response_model=List[OrderResponse])
def get_orders(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit:  int           = Query(50, le=200),
    db:     Session       = Depends(get_db),
):
    query = db.query(Order)

    if status and status != "all":
        query = query.filter(Order.status == status)

    if search:
        query = query.filter(
            Order.customer.ilike(f"%{search}%") |
            Order.id.ilike(f"%{search}%")
        )

    return query.limit(limit).all()