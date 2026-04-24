import os
import hmac
import hashlib
import base64
import httpx

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.auth import get_current_user
from dotenv import load_dotenv

load_dotenv()

SHOPIFY_API_KEY    = os.getenv("SHOPIFY_API_KEY", "")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET", "")
FRONTEND_URL       = os.getenv("FRONTEND_URL", "http://localhost:5173")

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


class ShopifyConnectRequest(BaseModel):
    shop:         str   # e.g. mystore.myshopify.com
    access_token: str


class ShopifyOAuthRequest(BaseModel):
    shop: str


@router.post("/shopify/oauth/start")
def shopify_oauth_start(
    payload:      ShopifyOAuthRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Step 1 of Shopify OAuth — generate the authorization URL.
    The frontend redirects the user to this URL.
    """
    shop   = payload.shop.strip().lower()
    scopes = "read_orders,read_products,read_customers,read_analytics"
    redirect_uri = f"{os.getenv('BACKEND_URL', 'http://localhost:8000')}/api/integrations/shopify/callback"

    auth_url = (
        f"https://{shop}/admin/oauth/authorize"
        f"?client_id={SHOPIFY_API_KEY}"
        f"&scope={scopes}"
        f"&redirect_uri={redirect_uri}"
        f"&state={current_user.id}"
    )

    return { "authorization_url": auth_url }


@router.get("/shopify/callback")
async def shopify_oauth_callback(
    shop:  str,
    code:  str,
    state: str,
    hmac_param: str = "",
    db:    Session = Depends(get_db),
):
    """
    Step 2 of Shopify OAuth — exchange code for access token.
    Shopify redirects here after the user approves.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://{shop}/admin/oauth/access_token",
            json={
                "client_id":     SHOPIFY_API_KEY,
                "client_secret": SHOPIFY_API_SECRET,
                "code":          code,
            },
        )

    if response.status_code != 200:
        raise HTTPException(400, "Failed to get Shopify access token.")

    data         = response.json()
    access_token = data.get("access_token")

    if not access_token:
        raise HTTPException(400, "No access token returned from Shopify.")

    # In production: store access_token encrypted in the database
    # tied to the user (state = user_id) and shop domain
    # For now we return it to the frontend to store
    return {
        "success":      True,
        "shop":         shop,
        "access_token": access_token,
        "user_id":      state,
    }


@router.post("/shopify/sync/orders")
async def sync_shopify_orders(
    payload:      ShopifyConnectRequest,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """
    Pull the latest 50 orders from Shopify and upsert them into our database.
    """
    from app.models.order import Order

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://{payload.shop}/admin/api/2024-01/orders.json"
            f"?limit=50&status=any",
            headers={
                "X-Shopify-Access-Token": payload.access_token,
                "Content-Type":           "application/json",
            },
        )

    if response.status_code != 200:
        raise HTTPException(400, "Failed to fetch orders from Shopify.")

    shopify_orders = response.json().get("orders", [])
    synced         = 0

    for o in shopify_orders:
        order_id   = f"shopify-{o['id']}"
        existing   = db.query(Order).filter(Order.id == order_id).first()
        status_map = {
            "paid":       "completed",
            "pending":    "pending",
            "refunded":   "refunded",
            "voided":     "refunded",
            "authorized": "pending",
        }

        if not existing:
            new_order = Order(
                id       = order_id,
                customer = f"{o.get('customer', {}).get('first_name', '')} "
                           f"{o.get('customer', {}).get('last_name', '')}".strip()
                           or "Guest",
                amount   = float(o.get("total_price", 0)),
                status   = status_map.get(o.get("financial_status", ""), "pending"),
                date     = o.get("created_at", "")[:10],
            )
            db.add(new_order)
            synced += 1

    db.commit()
    return { "synced": synced, "total": len(shopify_orders) }


@router.post("/shopify/sync/products")
async def sync_shopify_products(
    payload:      ShopifyConnectRequest,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """
    Pull products from Shopify and upsert into our database.
    """
    from app.models.product import Product

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://{payload.shop}/admin/api/2024-01/products.json?limit=50",
            headers={"X-Shopify-Access-Token": payload.access_token},
        )

    if response.status_code != 200:
        raise HTTPException(400, "Failed to fetch products from Shopify.")

    shopify_products = response.json().get("products", [])
    synced           = 0

    for p in shopify_products:
        product_id = f"shopify-{p['id']}"
        existing   = db.query(Product).filter(Product.id == product_id).first()

        if not existing:
            new_product = Product(
                id       = product_id,
                name     = p.get("title", "Unknown Product"),
                category = p.get("product_type", "General") or "General",
                sales    = 0,
                revenue  = 0.0,
                delta    = 0.0,
            )
            db.add(new_product)
            synced += 1

    db.commit()
    return { "synced": synced, "total": len(shopify_products) }