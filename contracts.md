# Clone X - Backend Implementation Contract

## Overview
This document outlines the API contracts, database schemas, and integration plan for the Clone X Twitter/X clone backend implementation.

## Technology Stack
- **Backend:** FastAPI (Python)
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT tokens
- **Email Service:** SMTP (Gmail)
- **AI Service:** Anthropic Claude (via Emergent LLM Key)

---

## 1. DATABASE MODELS

### User Model
```python
{
    "_id": ObjectId,
    "username": str (unique, indexed),
    "email": str (unique, indexed),
    "display_name": str,
    "password_hash": str,
    "bio": str (optional),
    "avatar": str (URL),
    "cover_image": str (URL, optional),
    "location": str (optional),
    "website": str (optional),
    "is_private": bool (default: False),
    "email_verified": bool (default: False),
    "email_verification_token": str (optional),
    "password_reset_token": str (optional),
    "password_reset_expires": datetime (optional),
    "created_at": datetime,
    "updated_at": datetime
}
```

### Tweet Model
```python
{
    "_id": ObjectId,
    "author_id": ObjectId (ref: User),
    "content": str,
    "media": [str] (URLs),
    "hashtags": [str],
    "parent_tweet_id": ObjectId (optional, for replies),
    "quoted_tweet_id": ObjectId (optional, for quote tweets),
    "is_reply": bool,
    "is_quote": bool,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Like Model
```python
{
    "_id": ObjectId,
    "user_id": ObjectId (ref: User),
    "tweet_id": ObjectId (ref: Tweet),
    "created_at": datetime
}
```

### Retweet Model
```python
{
    "_id": ObjectId,
    "user_id": ObjectId (ref: User),
    "tweet_id": ObjectId (ref: Tweet),
    "created_at": datetime
}
```

### Follow Model
```python
{
    "_id": ObjectId,
    "follower_id": ObjectId (ref: User),
    "following_id": ObjectId (ref: User),
    "created_at": datetime
}
```

### Block Model
```python
{
    "_id": ObjectId,
    "blocker_id": ObjectId (ref: User),
    "blocked_id": ObjectId (ref: User),
    "created_at": datetime
}
```

### Notification Model
```python
{
    "_id": ObjectId,
    "user_id": ObjectId (recipient),
    "actor_id": ObjectId (who triggered),
    "type": str (like, retweet, follow, reply),
    "tweet_id": ObjectId (optional),
    "content": str (optional, for replies),
    "read": bool (default: False),
    "created_at": datetime
}
```

---

## 2. API ENDPOINTS

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
**Request:**
```json
{
    "username": "johndoe",
    "display_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
}
```
**Response:**
```json
{
    "message": "Registration successful. Please check your email to verify your account.",
    "user": {
        "id": "user_id",
        "username": "johndoe",
        "email": "john@example.com"
    }
}
```

#### POST /api/auth/verify-email
**Request:**
```json
{
    "token": "verification_token"
}
```
**Response:**
```json
{
    "message": "Email verified successfully"
}
```

#### POST /api/auth/login
**Request:**
```json
{
    "email": "john@example.com",
    "password": "SecurePass123"
}
```
**Response:**
```json
{
    "access_token": "jwt_token",
    "token_type": "bearer",
    "user": {
        "id": "user_id",
        "username": "johndoe",
        "display_name": "John Doe",
        "email": "john@example.com",
        "avatar": "avatar_url",
        "bio": "...",
        "is_private": false,
        "email_verified": true
    }
}
```

#### POST /api/auth/forgot-password
**Request:**
```json
{
    "email": "john@example.com"
}
```
**Response:**
```json
{
    "message": "Password reset email sent"
}
```

#### POST /api/auth/reset-password
**Request:**
```json
{
    "token": "reset_token",
    "new_password": "NewSecurePass123"
}
```
**Response:**
```json
{
    "message": "Password reset successful"
}
```

#### PUT /api/auth/change-password
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "current_password": "OldPass123",
    "new_password": "NewPass123"
}
```
**Response:**
```json
{
    "message": "Password changed successfully"
}
```

### User Routes (`/api/users`)

#### GET /api/users/me
**Headers:** Authorization: Bearer {token}
**Response:** User object with followers/following counts

#### GET /api/users/{username}
**Headers:** Authorization: Bearer {token}
**Response:** User profile with stats

#### PUT /api/users/me
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "display_name": "John Doe",
    "bio": "Updated bio",
    "location": "New York",
    "website": "https://example.com",
    "is_private": false
}
```
**Response:** Updated user object

#### GET /api/users/{user_id}/followers
**Response:** List of followers

#### GET /api/users/{user_id}/following
**Response:** List of users being followed

### Tweet Routes (`/api/tweets`)

#### POST /api/tweets
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "content": "Tweet content with #hashtags",
    "media": ["url1", "url2"],
    "parent_tweet_id": "tweet_id" (optional, for replies),
    "quoted_tweet_id": "tweet_id" (optional, for quotes)
}
```
**Response:** Created tweet object with author info

#### GET /api/tweets/timeline
**Headers:** Authorization: Bearer {token}
**Query Params:** ?limit=20&skip=0
**Response:** List of tweets from followed users

#### GET /api/tweets/{tweet_id}
**Response:** Tweet object with author, likes, retweets, replies count

#### DELETE /api/tweets/{tweet_id}
**Headers:** Authorization: Bearer {token}
**Response:** 
```json
{
    "message": "Tweet deleted successfully"
}
```

#### GET /api/tweets/{tweet_id}/replies
**Response:** List of reply tweets

#### GET /api/tweets/user/{username}
**Query Params:** ?limit=20&skip=0
**Response:** List of user's tweets

### Interaction Routes (`/api/interactions`)

#### POST /api/interactions/like/{tweet_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "liked": true,
    "likes_count": 45
}
```

#### DELETE /api/interactions/like/{tweet_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "liked": false,
    "likes_count": 44
}
```

#### POST /api/interactions/retweet/{tweet_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "retweeted": true,
    "retweets_count": 12
}
```

#### DELETE /api/interactions/retweet/{tweet_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "retweeted": false,
    "retweets_count": 11
}
```

### Follow Routes (`/api/follow`)

#### POST /api/follow/{user_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "following": true,
    "followers_count": 1235
}
```

#### DELETE /api/follow/{user_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "following": false,
    "followers_count": 1234
}
```

### Block Routes (`/api/block`)

#### POST /api/block/{user_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "message": "User blocked successfully"
}
```

#### DELETE /api/block/{user_id}
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "message": "User unblocked successfully"
}
```

#### GET /api/block
**Headers:** Authorization: Bearer {token}
**Response:** List of blocked users

### Search Routes (`/api/search`)

#### GET /api/search
**Query Params:** ?q=query&type=all|users|tweets&limit=20
**Response:**
```json
{
    "users": [...],
    "tweets": [...]
}
```

#### GET /api/search/hashtag/{hashtag}
**Query Params:** ?limit=20&skip=0
**Response:** List of tweets with the hashtag

### Notification Routes (`/api/notifications`)

#### GET /api/notifications
**Headers:** Authorization: Bearer {token}
**Query Params:** ?limit=20&skip=0
**Response:** List of notifications

#### PUT /api/notifications/{notification_id}/read
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "message": "Notification marked as read"
}
```

#### PUT /api/notifications/read-all
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
    "message": "All notifications marked as read"
}
```

### AI Routes (`/api/ai`)

#### POST /api/ai/generate-content
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "prompt": "Write a tweet about AI technology",
    "max_length": 280
}
```
**Response:**
```json
{
    "content": "Generated tweet content"
}
```

#### POST /api/ai/suggest-hashtags
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "content": "Tweet content"
}
```
**Response:**
```json
{
    "hashtags": ["#AI", "#Tech", "#Innovation"]
}
```

#### POST /api/ai/analyze-tweet
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
    "tweet_id": "tweet_id"
}
```
**Response:**
```json
{
    "sentiment": "positive",
    "topics": ["technology", "innovation"],
    "engagement_prediction": "high",
    "suggestions": ["Consider adding a relevant image", "Post during peak hours"]
}
```

### Trending Routes (`/api/trending`)

#### GET /api/trending/hashtags
**Response:**
```json
{
    "hashtags": [
        {"tag": "AI", "count": 12453},
        {"tag": "WebDev", "count": 8934}
    ]
}
```

---

## 3. MOCK DATA TO REPLACE

### From mock.js:
1. **currentUser** → Replace with JWT token authentication and user data from MongoDB
2. **users** → Fetch from MongoDB users collection
3. **tweets** → Fetch from MongoDB tweets collection with aggregated likes, retweets, replies counts
4. **notifications** → Fetch from MongoDB notifications collection
5. **trendingHashtags** → Calculate from MongoDB by aggregating hashtags from recent tweets
6. **mockLogin()** → Replace with actual JWT authentication
7. **mockRegister()** → Replace with actual user creation + email verification
8. **mockToggleLike()** → Replace with actual like/unlike endpoint
9. **mockToggleFollow()** → Replace with actual follow/unfollow endpoint
10. **mockCreateTweet()** → Replace with actual tweet creation endpoint

---

## 4. FRONTEND-BACKEND INTEGRATION PLAN

### Files to Update:

#### 1. Create `/app/frontend/src/services/api.js`
- Axios instance with base URL and interceptors
- JWT token management
- Error handling

#### 2. Update `/app/frontend/src/context/AuthContext.js`
- Replace mock functions with actual API calls
- Store JWT token in localStorage
- Auto-refresh token handling

#### 3. Update `/app/frontend/src/pages/Home.jsx`
- Replace mockCreateTweet with API call
- Fetch timeline from API
- Real-time tweet posting

#### 4. Update `/app/frontend/src/pages/Profile.jsx`
- Fetch user data from API
- Fetch user tweets from API
- Update follow/unfollow logic

#### 5. Update `/app/frontend/src/pages/Login.jsx`
- Call actual login endpoint
- Handle JWT token storage

#### 6. Update `/app/frontend/src/pages/Register.jsx`
- Call actual registration endpoint
- Show email verification message

#### 7. Update `/app/frontend/src/pages/Notifications.jsx`
- Fetch notifications from API
- Mark as read functionality

#### 8. Update `/app/frontend/src/pages/Explore.jsx`
- Call search API
- Fetch trending hashtags from API

#### 9. Update `/app/frontend/src/components/TweetCard.jsx`
- Replace mock interactions with API calls
- Real-time like/retweet updates

---

## 5. BACKEND IMPLEMENTATION ORDER

1. **Authentication System**
   - User registration with email verification
   - Login with JWT tokens
   - Password reset flow
   - Email service setup

2. **User Management**
   - User profile CRUD
   - Follow/unfollow system
   - Block users

3. **Tweet System**
   - Create, read, delete tweets
   - Reply to tweets
   - Quote tweets
   - Hashtag extraction

4. **Interactions**
   - Like/unlike tweets
   - Retweet/unretweet
   - Notification creation on interactions

5. **Social Features**
   - Timeline generation
   - Search functionality
   - Trending hashtags calculation

6. **AI Integration (Claude)**
   - Content generation
   - Hashtag suggestions
   - Tweet analysis

7. **Notifications**
   - Real-time notifications
   - Mark as read

---

## 6. EMAIL SERVICE CONFIGURATION

**SMTP Settings (Gmail):**
- SMTP_HOST: smtp.gmail.com
- SMTP_PORT: 587
- SMTP_USER: user's gmail
- SMTP_PASSWORD: app password (not regular password)

**Email Templates:**
1. Email verification
2. Welcome email
3. Password reset
4. Password changed confirmation

---

## 7. AI INTEGRATION (CLAUDE)

**Use Cases:**
1. Generate tweet content based on user prompts
2. Suggest relevant hashtags for tweets
3. Analyze tweets for sentiment and engagement potential
4. Content improvement suggestions

**Implementation:**
- Use Emergent LLM Key
- Call Anthropic Claude API via emergentintegrations library
- Rate limiting to prevent abuse

---

## 8. SECURITY CONSIDERATIONS

1. **Password Hashing:** Use bcrypt with salt
2. **JWT Tokens:** Short expiration (1 hour), refresh token mechanism
3. **Email Verification:** Required before login
4. **Rate Limiting:** Prevent spam and abuse
5. **Input Validation:** Sanitize all user inputs
6. **CORS:** Properly configured for frontend domain
7. **Private Accounts:** Respect privacy settings in all queries

---

## 9. TESTING STRATEGY

1. Test authentication flow (register, verify, login)
2. Test tweet CRUD operations
3. Test social interactions (like, retweet, follow)
4. Test search and hashtag functionality
5. Test AI integration
6. Test email delivery
7. Test private account restrictions
8. Test blocking functionality

---

## END OF CONTRACT
