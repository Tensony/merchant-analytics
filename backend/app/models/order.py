from sqlalchemy import Column, String, Float
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id         = Column(String, primary_key=True, index=True)
    customer   = Column(String, nullable=False)
    amount     = Column(Float,  nullable=False)
    status     = Column(String, nullable=False)
    date       = Column(String, nullable=False)