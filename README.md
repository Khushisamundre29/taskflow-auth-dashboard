# Web App with Authentication & Dashboard

## 🚀 Project Overview
This project is a full-stack web application built as part of the **Frontend Developer Intern Assignment**.  
The goal is to demonstrate strong frontend engineering skills along with the ability to integrate a secure and scalable backend.

The application includes **user authentication, a protected dashboard, and CRUD operations** on a sample entity, following best practices for security, scalability, and code quality.

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login using **JWT-based authentication**
- Secure password hashing using **bcrypt**
- Protected routes (dashboard accessible only after login)
- Logout functionality with token invalidation

### 📊 Dashboard
- Displays logged-in user profile (fetched from backend)
- CRUD operations on a sample entity (Tasks / Notes / Posts)
- Search and filter functionality
- Responsive and user-friendly UI

### 🎨 Frontend
- Built using **React.js**
- Responsive design using **Tailwind CSS**
- Form validation (client-side + server-side)
- Clean UI with reusable components

### 🛠 Backend
- Lightweight backend built with **Node.js & Express**
- RESTful APIs for authentication, profile management, and CRUD operations
- Database integration using **MongoDB**
- Centralized error handling and validation middleware

---

## 🔒 Security Practices
- Passwords hashed using bcrypt
- JWT authentication with middleware-based route protection
- Input validation on both frontend and backend
- Secure API error handling (no sensitive data exposure)

---

## 📬 API Endpoints (Overview)

- `POST /api/auth/register` – User registration  
- `POST /api/auth/login` – User login  
- `GET /api/user/profile` – Fetch user profile  
- `PUT /api/user/profile` – Update user profile  
- `GET /api/items` – Fetch all items  
- `POST /api/items` – Create new item  
- `PUT /api/items/:id` – Update item  
- `DELETE /api/items/:id` – Delete item  

A Postman collection is included for API testing.

---

## 🧪 Testing
- APIs tested using **Postman**
- Frontend tested manually for responsiveness and edge cases
- Authentication flow validated end-to-end

---

## 📈 Scalability Notes (Production Ready Approach)

To scale this application for production:
- Separate frontend and backend deployments
- Use environment-based configuration for API URLs and secrets
- Implement refresh tokens for authentication
- Add role-based access control (RBAC)
- Introduce API rate limiting and request logging
- Use a production-ready database with indexing
- Enable caching for frequently accessed data
- Add CI/CD pipelines for automated testing and deployment

---

## 📁 Deliverables
- Full frontend and backend source code
- Functional authentication system
- Dashboard with CRUD operations
- Postman API documentation
- Production scalability notes

---
## 🚀 Getting Started
- Clone the Repository -> git clone https://github.com/your-username/your-repo-name.git

## Backend Setup
- cd backend
- npm install
- npm run dev

## Create a .env file:

- PORT=8000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
  
## Frontend Setup
- cd frontend
- npm install
- npm start
---
## 👩‍💻 Author
**Khushi Samundre**   
