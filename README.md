# Clone X - Twitter/X Clone

A full-stack social media application inspired by Twitter/X, built with modern technologies.

![Clone X](https://img.shields.io/badge/Status-In%20Development-yellow)
![React](https://img.shields.io/badge/React-19.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Ready-brightgreen)

## 🌟 Overview

Clone X is a feature-rich social media platform that replicates core Twitter/X functionalities with a modern tech stack. It includes user authentication, tweet management, social interactions, search capabilities, and AI-powered features.

## 🚀 Quick Start

```bash
# Extract the project
unzip clone-x-project.zip
cd clone-x-project

# Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install

# Start MongoDB (ensure it's running)
# Start backend (in one terminal)
cd backend && uvicorn server:app --reload --port 8001

# Start frontend (in another terminal)
cd frontend && yarn start
```

Visit: http://localhost:3000

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[contracts.md](contracts.md)** - API specifications and contracts

## ✨ Features

### ✅ Implemented
- User authentication (register, login, email verification)
- JWT-based authorization
- Password reset functionality
- User profiles with customizable settings
- Modern, responsive UI
- Tweet composer and timeline
- Social interactions (like, retweet, reply) - Frontend
- Follow/unfollow system - Frontend
- Notifications feed - Frontend
- Search and explore - Frontend
- Private/public account settings

### 🚧 In Progress
- Backend tweet CRUD endpoints
- Real-time notifications
- Image upload functionality
- AI-powered content generation
- Hashtag analytics

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- shadcn/ui components
- Axios

**Backend:**
- FastAPI (Python)
- Motor (async MongoDB)
- JWT authentication
- Pydantic validation
- emergentintegrations (AI)

**Database:**
- MongoDB

**AI:**
- Anthropic Claude (via Emergent LLM)

## 📦 Project Structure

```
clone-x-project/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── mock.js       # Mock data
│   └── package.json
├── backend/              # FastAPI application
│   ├── routers/         # API routes
│   ├── models.py        # Data models
│   ├── database.py      # MongoDB setup
│   ├── auth.py          # Authentication
│   ├── ai_service.py    # AI integration
│   └── server.py        # Main app
├── QUICKSTART.md        # Quick setup guide
├── SETUP_GUIDE.md       # Detailed documentation
└── contracts.md         # API contracts
```

## 🔧 Configuration

### Backend (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="clone_x_database"
JWT_SECRET="your-secret-key"
EMERGENT_LLM_KEY="sk-emergent-535372a18DcBbEc5a2"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📸 Screenshots

**Login Page:**
- Clean, modern authentication interface
- Email verification flow
- Password reset functionality

**Home Timeline:**
- Tweet composer with media support
- Real-time feed
- Interactive tweet cards

**User Profile:**
- Customizable bio and avatar
- Follower/following counts
- Tabbed content (Posts, Replies, Media, Likes)

**Explore:**
- Trending hashtags
- User search
- Tweet discovery

## 🧪 Testing

```bash
# Test user registration
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "display_name": "Test User", "email": "test@example.com", "password": "Test123"}'

# Test login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123"}'
```

## 🤝 Contributing

This is a demonstration project showcasing full-stack development capabilities.

## 📄 License

Open source - Educational purposes

## 🙏 Acknowledgments

- Built with React, FastAPI, and MongoDB
- UI components from shadcn/ui
- Icons from Lucide React
- AI powered by Anthropic Claude

## 📞 Support

For issues or questions:
1. Check the comprehensive guides (SETUP_GUIDE.md)
2. Review API contracts (contracts.md)
3. Check backend/frontend logs
4. Review MongoDB connection

## 🎯 Current Status

- ✅ Frontend: Fully functional with mock data
- ✅ Backend: Authentication system complete
- ✅ Database: MongoDB configured with indexes
- ✅ AI: Claude integration ready
- 🚧 Full-stack integration: In progress

## 🚀 Next Steps

1. Implement remaining backend endpoints
2. Replace mock data with API calls
3. Add real-time features
4. Implement image upload
5. Complete AI integration

---

**Built with ❤️ using modern web technologies**

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
