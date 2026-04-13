from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    sort_by:  str           = Query("revenue"),
    sort_dir: str           = Query("desc"),
    db:       Session       = Depends(get_db),
):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category)

    sort_col = getattr(Product, sort_by, Product.revenue)
    query = query.order_by(
        sort_col.desc() if sort_dir == "desc" else sort_col.asc()
    )

    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.id == product_id).first()