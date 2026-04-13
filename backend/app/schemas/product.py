from pydantic import BaseModel


class ProductBase(BaseModel):
    id:       str
    name:     str
    category: str
    sales:    int
    revenue:  float
    delta:    float


class ProductResponse(ProductBase):
    class Config:
        from_attributes = True