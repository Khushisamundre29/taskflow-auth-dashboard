# 🔐 Auth Dashboard App

A full-stack web app with **user authentication, JWT security, and a dashboard** for managing items.

## ⚡ Tech Stack
**Frontend:** React + Tailwind | **Backend:** Node.js + Express | **Database:** MongoDB | **Auth:** JWT + Bcrypt

## ✨ Features
- 🔑 Secure signup/login with JWT tokens
- 📊 Protected dashboard (login required)
- ✏️ Create, read, update, delete items
- 🔍 Search & filter functionality
- 📱 Responsive design

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```
Create `.env`:
```
PORT=8000
MONGO_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret_key
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints
```
POST   /api/auth/register      Sign up
POST   /api/auth/login         Log in
GET    /api/user/profile       Get user info
GET    /api/items              Get all items
POST   /api/items              Create item
PUT    /api/items/:id          Update item
DELETE /api/items/:id          Delete item
```

## 🔒 Security
- Passwords hashed with bcrypt
- JWT middleware protects routes
- Input validation on both sides
- Safe error handling

## 📝 How It Works
1. User signs up → password hashed → saved to DB
2. User logs in → JWT token generated
3. Token stored in browser → sent with every request
4. Backend verifies token → grants access

---

Made by **Khushi Samundre** 
