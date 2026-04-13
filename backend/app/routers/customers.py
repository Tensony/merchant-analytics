from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerResponse

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("/", response_model=List[CustomerResponse])
def get_customers(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db:     Session       = Depends(get_db),
):
    query = db.query(Customer)

    if status and status != "all":
        query = query.filter(Customer.status == status)

    if search:
        query = query.filter(
            Customer.name.ilike(f"%{search}%") |
            Customer.email.ilike(f"%{search}%")
        )

    return query.all()