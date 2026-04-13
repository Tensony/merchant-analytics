from sqlalchemy import Column, String, Float, Integer
from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id          = Column(String,  primary_key=True, index=True)
    name        = Column(String,  nullable=False)
    email       = Column(String,  nullable=False, unique=True)
    country     = Column(String,  nullable=False)
    total_spend = Column(Float,   default=0.0)
    orders      = Column(Integer, default=0)
    last_order  = Column(String,  nullable=False)
    status      = Column(String,  nullable=False)