from fastapi import APIRouter, HTTPException, status, Depends
from models import (
    UserCreate, UserResponse, LoginRequest, TokenResponse,
    VerifyEmailRequest, ForgotPasswordRequest, ResetPasswordRequest,
    ChangePasswordRequest
)
from database import users_collection
from auth import hash_password, verify_password, create_access_token, get_current_user
from email_service import send_verification_email, send_password_reset_email, send_password_changed_email
from utils import get_user_response
from datetime import datetime, timedelta
import secrets
from database import follows_collection
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    # Check if user already exists
    if await users_collection.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if await users_collection.find_one({"username": user_data.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user document
    verification_token = secrets.token_urlsafe(32)
    user_doc = {
        "username": user_data.username,
        "display_name": user_data.display_name,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "bio": "",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.username}",
        "is_private": False,
        "email_verified": False,
        "email_verification_token": verification_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    
    # Send verification email
    send_verification_email(user_data.email, user_data.username, verification_token)
    
    return {
        "message": "Registration successful. Please check your email to verify your account.",
        "user": {
            "id": str(result.inserted_id),
            "username": user_data.username,
            "email": user_data.email
        }
    }


@router.post("/verify-email")
async def verify_email(data: VerifyEmailRequest):
    user = await users_collection.find_one({"email_verification_token": data.token})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "email_verified": True,
                "updated_at": datetime.utcnow()
            },
            "$unset": {"email_verification_token": ""}
        }
    )
    
    return {"message": "Email verified successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    user = await users_collection.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.get("email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    # Get user response with counts
    user_response = await get_user_response(user, follows_collection)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user_response)
    )


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await users_collection.find_one({"email": data.email})
    
    if not user:
        # Don't reveal if email exists or not
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_expires = datetime.utcnow() + timedelta(hours=1)
    
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password_reset_token": reset_token,
                "password_reset_expires": reset_expires,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Send reset email
    send_password_reset_email(user["email"], user["username"], reset_token)
    
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    user = await users_collection.find_one({
        "password_reset_token": data.token,
        "password_reset_expires": {"$gt": datetime.utcnow()}
    })
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password_hash": hash_password(data.new_password),
                "updated_at": datetime.utcnow()
            },
            "$unset": {
                "password_reset_token": "",
                "password_reset_expires": ""
            }
        }
    )
    
    send_password_changed_email(user["email"], user["username"])
    
    return {"message": "Password reset successful"}


@router.put("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    if not verify_password(data.current_password, current_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "password_hash": hash_password(data.new_password),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    send_password_changed_email(current_user["email"], current_user["username"])
    
    return {"message": "Password changed successfully"}
