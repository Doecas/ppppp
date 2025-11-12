# Clone X - Setup Guide

A full-stack Twitter/X clone built with FastAPI, React, and MongoDB.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (v4.4 or higher)
- **yarn** package manager
- **Git**

---

## 📁 Project Structure

```
clone-x-project/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── mock.js       # Mock data (temporary)
│   ├── package.json
│   └── .env
├── backend/           # FastAPI backend application
│   ├── routers/          # API route handlers
│   ├── models.py         # Pydantic models
│   ├── database.py       # MongoDB setup
│   ├── auth.py           # Authentication utilities
│   ├── email_service.py  # Email sending service
│   ├── ai_service.py     # AI integration (Claude)
│   ├── utils.py          # Helper functions
│   ├── server.py         # Main FastAPI app
│   ├── requirements.txt
│   └── .env
└── contracts.md       # API contracts documentation
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
# Extract the ZIP file or clone from repository
cd clone-x-project
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

Edit `/backend/.env` file:

```env
# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="clone_x_database"

# CORS
CORS_ORIGINS="*"

# JWT Configuration
JWT_SECRET="your-secret-key-change-in-production"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24

# Emergent LLM Key (for AI features)
EMERGENT_LLM_KEY="sk-emergent-535372a18DcBbEc5a2"

# Email Configuration (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"
FRONTEND_URL="http://localhost:3000"
```

**Note on Gmail SMTP:**
- You need to enable 2-factor authentication on your Gmail account
- Generate an "App Password" from Google Account settings
- Use the App Password (not your regular password) in SMTP_PASSWORD

### Frontend Configuration (.env)

Edit `/frontend/.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🏃 Running the Application

### 1. Start MongoDB

```bash
# Make sure MongoDB is running
# On macOS (with Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongodb

# On Windows:
# Start MongoDB service from Services panel
```

### 2. Start Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Backend will be available at: http://localhost:8001

API documentation: http://localhost:8001/docs

### 3. Start Frontend

```bash
cd frontend
yarn start
```

Frontend will be available at: http://localhost:3000

---

## ✨ Features

### ✅ Implemented Features:

**Authentication & User Management:**
- User registration with email verification
- Login/logout with JWT tokens
- Password reset functionality
- Email verification flow
- User profile management
- Private/public account settings

**Frontend (with Mock Data):**
- Home timeline with tweet composer
- User profiles with tabs (Posts, Replies, Media, Likes)
- Notifications feed
- Explore/Search functionality
- Settings page (Profile, Password, Privacy)
- Tweet interactions (like, retweet, reply)
- Follow/unfollow users
- Responsive design with modern UI

**Backend (Auth System Complete):**
- JWT-based authentication
- Email service integration
- MongoDB database with indexes
- AI service integration (Claude) ready

### 🚧 To Be Implemented:

**Backend Routes:**
- Tweet CRUD endpoints
- Social interaction endpoints (like, retweet, follow)
- Search and hashtag endpoints
- Notifications system
- AI integration endpoints (content generation, hashtag suggestions)

**Frontend Integration:**
- Replace mock data with actual API calls
- Real-time updates
- Image upload functionality

---

## 🛠️ Technology Stack

### Frontend:
- **React 19** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend:
- **FastAPI** - Web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **bcrypt** - Password hashing
- **emergentintegrations** - AI integration (Claude)

### Database:
- **MongoDB** - NoSQL database

### AI:
- **Anthropic Claude** - Content generation, hashtag suggestions

---

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

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

#### POST /api/auth/login
Login with email and password.

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
    ...
  }
}
```

#### POST /api/auth/verify-email
Verify email address with token.

**Request:**
```json
{
  "token": "verification_token"
}
```

#### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

#### POST /api/auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "new_password": "NewSecurePass123"
}
```

#### PUT /api/auth/change-password
Change password (requires authentication).

**Request:**
```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass123"
}
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

---

## 🔍 Testing

### Test User Registration:

```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "display_name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Login:

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check MongoDB connection string in backend/.env
- Default port: 27017

### Email Not Sending:
- Verify Gmail SMTP credentials
- Enable 2-factor authentication on Gmail
- Use App Password, not regular password
- Check firewall settings for port 587

### Port Already in Use:
- Backend port 8001: `lsof -ti:8001 | xargs kill -9`
- Frontend port 3000: `lsof -ti:3000 | xargs kill -9`

### Module Not Found Errors:
- Backend: Re-run `pip install -r requirements.txt`
- Frontend: Re-run `yarn install`

---

## 📝 Development Notes

### Current Status:
- **Frontend:** Fully functional with mock data
- **Backend:** Authentication system complete
- **Database:** Indexes created and ready
- **AI Integration:** Configured and ready (not yet connected to frontend)

### Next Steps:
1. Implement remaining backend routes (tweets, interactions, search)
2. Replace frontend mock data with actual API calls
3. Implement real-time notifications
4. Add image upload functionality
5. Testing and bug fixes

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👥 Contributors

Built as a demonstration of full-stack development capabilities.

---

## 📞 Support

For issues or questions:
- Check the `contracts.md` file for API specifications
- Review backend logs: Check console output when running uvicorn
- Review frontend logs: Check browser console (F12)

---

## 🎉 Getting Started

1. Follow the installation steps above
2. Start MongoDB, Backend, and Frontend
3. Open http://localhost:3000 in your browser
4. Click "Sign up" to create a test account
5. Explore the fully functional UI with mock data

**Note:** Email verification is required for login. Check the backend console for verification links if SMTP is not configured.

---

**Happy Coding! 🚀**
