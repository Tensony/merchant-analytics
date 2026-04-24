import hmac
import hashlib
import json
import os
import httpx

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.auth import get_current_user
from dotenv import load_dotenv

load_dotenv()

PAYSTACK_SECRET = os.getenv("PAYSTACK_SECRET_KEY", "")
FRONTEND_URL    = os.getenv("FRONTEND_URL", "http://localhost:5173")

router = APIRouter(prefix="/api/payments", tags=["payments"])

PLAN_AMOUNTS = {
    "growth": 1900,   # $19.00 in cents
    "pro":    4900,   # $49.00 in cents
}

PLAN_CODES = {
    "growth": "PLN_growth_monthly",
    "pro":    "PLN_pro_monthly",
}


class InitializePaymentRequest(BaseModel):
    plan: str


class VerifyPaymentRequest(BaseModel):
    reference: str
    plan:      str


@router.post("/initialize")
async def initialize_payment(
    payload:      InitializePaymentRequest,
    current_user: User = Depends(get_current_user),
):
    if payload.plan not in PLAN_AMOUNTS:
        raise HTTPException(400, "Invalid plan selected.")

    amount   = PLAN_AMOUNTS[payload.plan]
    callback = f"{FRONTEND_URL}/app/settings?payment=success&plan={payload.plan}"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.paystack.co/transaction/initialize",
            headers={
                "Authorization": f"Bearer {PAYSTACK_SECRET}",
                "Content-Type":  "application/json",
            },
            json={
                "email":        current_user.email,
                "amount":       amount * 100,  # Paystack uses kobo/cents
                "currency":     "USD",
                "callback_url": callback,
                "metadata": {
                    "user_id":    current_user.id,
                    "plan":       payload.plan,
                    "user_email": current_user.email,
                },
            },
        )

    if response.status_code != 200:
        raise HTTPException(502, "Failed to initialize payment with Paystack.")

    data = response.json()
    if not data.get("status"):
        raise HTTPException(400, data.get("message", "Payment initialization failed."))

    return {
        "authorization_url": data["data"]["authorization_url"],
        "reference":         data["data"]["reference"],
        "access_code":       data["data"]["access_code"],
    }


@router.post("/verify")
async def verify_payment(
    payload:      VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.paystack.co/transaction/verify/{payload.reference}",
            headers={"Authorization": f"Bearer {PAYSTACK_SECRET}"},
        )

    if response.status_code != 200:
        raise HTTPException(502, "Failed to verify payment.")

    data = response.json()

    if not data.get("status") or data["data"]["status"] != "success":
        raise HTTPException(400, "Payment was not successful.")

    # Upgrade user plan in database
    user = db.query(User).filter(User.id == current_user.id).first()
    if user:
        user.plan = payload.plan
        db.commit()
        db.refresh(user)

    return {
        "success": True,
        "plan":    payload.plan,
        "message": f"Successfully upgraded to {payload.plan} plan.",
    }


@router.post("/webhook")
async def paystack_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Paystack sends webhooks for payment events.
    Verify the signature then update the user's plan.
    """
    body      = await request.body()
    signature = request.headers.get("x-paystack-signature", "")

    # Verify webhook signature
    expected = hmac.new(
        PAYSTACK_SECRET.encode("utf-8"),
        body,
        hashlib.sha512,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(401, "Invalid webhook signature.")

    event = json.loads(body)

    if event.get("event") == "charge.success":
        metadata = event["data"].get("metadata", {})
        user_id  = metadata.get("user_id")
        plan     = metadata.get("plan")

        if user_id and plan:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.plan = plan
                db.commit()

    return {"status": "ok"}