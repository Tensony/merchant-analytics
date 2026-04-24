import uuid
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest, LoginRequest,
    AuthResponse, TokenResponse, UserResponse,
)
from app.auth import (
    hash_password, verify_password,
    create_access_token, get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def validate_password(password: str) -> str | None:
    if len(password) < 8:
        return "Password must be at least 8 characters."
    return None


def validate_email_format(email: str) -> bool:
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Validate name
    if not payload.name.strip():
        raise HTTPException(400, "Full name is required.")

    # Validate email format
    if not validate_email_format(payload.email):
        raise HTTPException(400, "Please enter a valid email address.")

    # Validate password strength
    pw_error = validate_password(payload.password)
    if pw_error:
        raise HTTPException(400, pw_error)

    # Check duplicate
    existing = db.query(User).filter(
        User.email == payload.email.lower()
    ).first()
    if existing:
        raise HTTPException(
            400,
            "An account with this email already exists. Please sign in."
        )

    # Create user
    user = User(
        id              = str(uuid.uuid4()),
        name            = payload.name.strip(),
        email           = payload.email.lower(),
        hashed_password = hash_password(payload.password),
        plan            = "starter",
        avatar          = payload.name.strip()[:2].upper(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})

    return AuthResponse(
        token=TokenResponse(access_token=token),
        user=UserResponse(
            id=user.id, name=user.name, email=user.email,
            plan=user.plan, avatar=user.avatar,
        ),
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if not payload.email:
        raise HTTPException(400, "Email is required.")
    if not payload.password:
        raise HTTPException(400, "Password is required.")

    user = db.query(User).filter(
        User.email == payload.email.lower()
    ).first()

    if not user:
        raise HTTPException(
            401,
            "No account found with this email. Please register first."
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Incorrect password. Please try again.")

    if not user.is_active:
        raise HTTPException(403, "This account has been deactivated.")

    token = create_access_token({"sub": user.id})

    return AuthResponse(
        token=TokenResponse(access_token=token),
        user=UserResponse(
            id=user.id, name=user.name, email=user.email,
            plan=user.plan, avatar=user.avatar,
        ),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id, name=current_user.name,
        email=current_user.email, plan=current_user.plan,
        avatar=current_user.avatar,
    )


@router.post("/logout")
def logout():
    # JWT is stateless — client deletes the token
    return {"message": "Logged out successfully"}