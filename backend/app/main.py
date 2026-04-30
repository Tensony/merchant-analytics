import os
import asyncio
import json
import random
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import Product, Order, Customer, Campaign
from app.models.user import User
from app.routers import products, orders, customers, campaigns, metrics, auth, payments, integrations
from sqlalchemy import inspect

# ── Auto-seed on first run ────────────────────────────────────────────────────

def auto_seed():
    """Seed database only if tables are empty."""
    inspector = inspect(engine)
    if not inspector.has_table("users"):
        return
    
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            from app.seed import seed
            seed()
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
auto_seed()

# ── FastAPI App ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Merchant Analytics API",
    description="Backend API for the Merchant Analytics Console",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://merchant-analytics.vercel.app",
        "https://merchant-analytics-git-main-tensonys-projects.vercel.app",
        "https://merchant-analytics-n1dkxj3qt-tensonys-projects.vercel.app",
        "https://www.merchant-analytics.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(customers.router)
app.include_router(campaigns.router)
app.include_router(metrics.router)
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(integrations.router)


@app.get("/")
def root():
    return {
        "status":  "ok",
        "message": "Merchant Analytics API is running",
        "docs":    "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# ── WebSocket — live order feed ───────────────────────────────────────────────

CUSTOMERS = [
    "Alex Mwale", "Sarah Chen", "James Osei", "Maria Santos",
    "Tom Nakamura", "Fatima Al-Hassan", "Chioma Eze", "Amara Diallo",
    "Nina Petrova", "Kwame Asante", "Zara Ahmed", "David Park",
]

PRODUCTS_LIST = [
    ("Pro Wireless Headphones", 79.99),
    ("Ergonomic Desk Chair",    172.50),
    ("Mechanical Keyboard",     69.99),
    ("USB-C Hub (7-port)",      29.99),
    ("Monitor Stand",           39.99),
    ("Laptop Stand",            49.99),
    ("Webcam HD 1080p",         59.99),
]

STATUSES = ["completed", "completed", "completed", "pending", "pending", "refunded"]


def generate_live_order() -> dict:
    product, price = random.choice(PRODUCTS_LIST)
    qty    = random.randint(1, 3)
    amount = round(price * qty, 2)
    return {
        "id":       f"#{random.randint(48300, 99999)}",
        "customer": random.choice(CUSTOMERS),
        "product":  product,
        "amount":   amount,
        "status":   random.choice(STATUSES),
        "date":     datetime.now().strftime("%b %d, %H:%M"),
        "ts":       datetime.now().isoformat(),
    }


@app.websocket("/ws/orders")
async def websocket_orders(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            order = generate_live_order()
            await websocket.send_text(json.dumps(order))
            # Send a new order every 4–8 seconds
            await asyncio.sleep(random.uniform(4, 8))
    except WebSocketDisconnect:
        pass