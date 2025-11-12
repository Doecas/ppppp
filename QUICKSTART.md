# Clone X - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Step 1: Extract Files
```bash
unzip clone-x-project.zip
cd clone-x-project
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
yarn install
```

### Step 3: Start Services

**Terminal 1 - Start MongoDB:**
```bash
# macOS/Linux
sudo systemctl start mongodb
# or
mongod

# Windows: Start MongoDB service
```

**Terminal 2 - Start Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
yarn start
```

### Step 4: Access the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001
- **API Docs:** http://localhost:8001/docs

### Step 5: Create Account
1. Click "Sign up"
2. Fill in registration form
3. Check backend console for verification link (if email not configured)
4. Click link to verify email
5. Login and explore!

---

## 📧 Email Configuration (Optional)

If you want real emails, edit `backend/.env`:

```env
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"
```

**Get Gmail App Password:**
1. Enable 2FA on Gmail
2. Go to Google Account Settings
3. Security → App Passwords
4. Generate password for "Mail"
5. Use generated password in SMTP_PASSWORD

---

## 🎯 What Works Now?

✅ **Frontend (with mock data):**
- Login/Register pages
- Home timeline
- User profiles
- Notifications
- Explore/Search
- Settings
- Tweet interactions

✅ **Backend:**
- User registration
- Email verification
- Login with JWT
- Password reset
- MongoDB integration
- AI service ready

---

## 📖 Need More Details?

See **SETUP_GUIDE.md** for comprehensive documentation!

---

**Enjoy building with Clone X! 🎉**
