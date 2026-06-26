# Auth Dashboard App

A full-stack web application featuring secure user authentication, JWT-based authorization, and a complete dashboard for managing items. Built with modern security best practices and a responsive, intuitive interface.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+ • Tailwind CSS |
| **Backend** | Node.js • Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) • Bcrypt |
| **Security** | CORS • Input Validation • Error Handling |

---

## Features

- **Secure Authentication**
  - User signup with password hashing (bcrypt)
  - JWT-based login with token generation
  - Protected routes with middleware verification

- **Protected Dashboard**
  - Login required for access
  - Real-time token validation
  - Automatic logout on token expiry

- **Item Management**
  - Create new items
  - View all items with pagination
  - Update existing items
  - Delete items with confirmation

- **Search & Filter**
  - Real-time search functionality
  - Filter by category or status
  - Sort by date, name, or custom fields

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Touch-friendly interface

---

## Quick Start

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) — [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** — Comes with Node.js

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file in the backend root
cat > .env << EOF
PORT=8000
MONGO_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
EOF

# Start the development server
npm run dev
```

**Backend runs on:** `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/register` | Create a new user account 
| `POST` | `/api/auth/login` | Sign in and receive JWT token

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/api/user/profile` | Retrieve current user information 

### Item Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/api/items` | Get all items for the user 
| `POST` | `/api/items` | Create a new item 
| `PUT` | `/api/items/:id` | Update an existing item 
| `DELETE` | `/api/items/:id` | Delete an item 

### Example API Calls

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Create an item (with token):**
```bash
curl -X POST http://localhost:8000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "My First Item",
    "description": "A sample item",
    "category": "work"
  }'
```

---

## Security Features

### Password Security
- Passwords hashed using **Bcrypt** with salt rounds (10)
- Never stored in plain text
- Bcrypt automatically handles salt generation and verification

### JWT Authentication
- **Token Generation**: Issued upon successful login
- **Token Storage**: Stored in browser's localStorage/sessionStorage
- **Token Verification**: Middleware checks token validity on protected routes
- **Token Expiry**: Tokens expire after 7 days (configurable)

### Request Security
- **CORS Protection**: Whitelist allowed origins
- **Input Validation**: Both frontend and backend validate user input
- **Error Handling**: Safe error messages that don't expose system details
- **SQL Injection Prevention**: MongoDB prevents injection attacks natively

### Best Practices
```javascript
// Example: Protected route middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

---

## Authentication Flow

```
1. User Registration
   └─ User submits name, email, password
   └─ Password hashed with bcrypt
   └─ User saved to MongoDB
   └─ Success response sent

2. User Login
   └─ User submits email, password
   └─ System finds user by email
   └─ Password compared with hash (bcrypt)
   └─ JWT token generated with user ID
   └─ Token sent to frontend

3. Request with Authentication
   └─ Frontend stores token (localStorage)
   └─ Frontend sends token in Authorization header
   └─ Backend middleware verifies token
   └─ If valid: Request processed, response sent
   └─ If invalid: 401 Unauthorized error

4. Logout
   └─ Frontend clears token from localStorage
   └─ Redirects to login page
   └─ Token becomes invalid for future requests
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/auth-app
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-app

# JWT Configuration
JWT_SECRET=your_extremely_secure_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## Environment Variables Details

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `8000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-app` |
| `JWT_SECRET` | Secret key for signing tokens | `your_secret_key_min_32_chars` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `NODE_ENV` | Environment type | `development` or `production` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:3000` |

 **Important**: 
- Change `JWT_SECRET` in production
- Use MongoDB Atlas for cloud deployment
- Never commit `.env` files to version control

---

## Testing the Application

### Test User Signup
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Enter name, email, and password
4. Submit and verify success message

### Test User Login
1. On the login page, enter credentials
2. Click "Login"
3. Verify token is stored in browser localStorage
4. Should redirect to dashboard

### Test Protected Routes
1. Try accessing `/dashboard` without logging in
2. Should redirect to login page
3. After login, dashboard is accessible
4. Items can be created, edited, and deleted

### Test Token Expiry
1. Login and get a token
2. Wait for token expiry (or modify JWT_EXPIRE in `.env`)
3. Try making an API request
4. Should receive 401 Unauthorized error

---

## Technologies Used

- **React**: UI framework
- **Tailwind CSS**: Styling
- **Express.js**: Backend framework
- **MongoDB**: NoSQL database
- **Bcrypt**: Password hashing
- **JWT**: Token-based authentication
- **Axios**: HTTP client (optional)
- **Mongoose**: MongoDB ODM (optional)

---

**Created by Khushi Samundre** 
