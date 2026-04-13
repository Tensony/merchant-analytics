from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import products, orders, customers, campaigns, metrics

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Merchant Analytics API",
    description="Backend API for the Merchant Analytics Console",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(customers.router)
app.include_router(campaigns.router)
app.include_router(metrics.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Merchant Analytics API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}