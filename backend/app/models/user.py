from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id              = Column(String,  primary_key=True, index=True)
    name            = Column(String,  nullable=False)
    email           = Column(String,  unique=True, index=True, nullable=False)
    hashed_password = Column(String,  nullable=False)
    plan            = Column(String,  default="starter")
    avatar          = Column(String,  default="")
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())