from sqlalchemy import Column, String, Float, Integer
from app.database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id          = Column(String,  primary_key=True, index=True)
    name        = Column(String,  nullable=False)
    channel     = Column(String,  nullable=False)
    status      = Column(String,  nullable=False)
    budget      = Column(Float,   default=0.0)
    spent       = Column(Float,   default=0.0)
    impressions = Column(Integer, default=0)
    clicks      = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    revenue     = Column(Float,   default=0.0)
    start_date  = Column(String,  nullable=False)
    end_date    = Column(String,  nullable=False)