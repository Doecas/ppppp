from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


# User Models
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    display_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    is_private: Optional[bool] = None


class UserResponse(BaseModel):
    id: str
    username: str
    display_name: str
    email: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    is_private: bool = False
    email_verified: bool = False
    followers: int = 0
    following: int = 0
    created_at: datetime

    class Config:
        json_encoders = {ObjectId: str}


# Tweet Models
class TweetCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=280)
    media: Optional[List[str]] = []
    parent_tweet_id: Optional[str] = None
    quoted_tweet_id: Optional[str] = None


class TweetResponse(BaseModel):
    id: str
    author: UserResponse
    content: str
    media: List[str] = []
    hashtags: List[str] = []
    parent_tweet_id: Optional[str] = None
    quoted_tweet_id: Optional[str] = None
    is_reply: bool = False
    is_quote: bool = False
    likes: int = 0
    retweets: int = 0
    replies: int = 0
    is_liked: bool = False
    is_retweeted: bool = False
    created_at: datetime

    class Config:
        json_encoders = {ObjectId: str}


# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class VerifyEmailRequest(BaseModel):
    token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


# Notification Models
class NotificationResponse(BaseModel):
    id: str
    type: str  # like, retweet, follow, reply
    user: UserResponse
    tweet: Optional[TweetResponse] = None
    content: Optional[str] = None
    read: bool = False
    created_at: datetime

    class Config:
        json_encoders = {ObjectId: str}


# AI Models
class AIGenerateContentRequest(BaseModel):
    prompt: str
    max_length: int = 280


class AIGenerateContentResponse(BaseModel):
    content: str


class AISuggestHashtagsRequest(BaseModel):
    content: str


class AISuggestHashtagsResponse(BaseModel):
    hashtags: List[str]


class AIAnalyzeTweetRequest(BaseModel):
    tweet_id: str


class AIAnalyzeTweetResponse(BaseModel):
    sentiment: str
    topics: List[str]
    engagement_prediction: str
    suggestions: List[str]


# Search Response
class SearchResponse(BaseModel):
    users: List[UserResponse] = []
    tweets: List[TweetResponse] = []


# Trending
class TrendingHashtag(BaseModel):
    tag: str
    count: int
