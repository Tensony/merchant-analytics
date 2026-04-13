
from sqlalchemy import Column, String, Integer, Float
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id       = Column(String,  primary_key=True, index=True)
    name     = Column(String,  nullable=False)
    category = Column(String,  nullable=False)
    sales    = Column(Integer, default=0)
    revenue  = Column(Float,   default=0.0)
    delta    = Column(Float,   default=0.0)