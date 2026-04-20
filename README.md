# STRYVE — Intelligent Workout System

A full-stack fitness web application built with React, Node.js, Express, and MongoDB.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 · Vite · Tailwind CSS v3  |
| Backend   | Node.js · Express                   |
| Database  | MongoDB · Mongoose                  |
| Auth      | JWT · bcrypt                        |

## Project Structure

```
Stryve/
├── client/          # React frontend
│   └── src/
│       ├── api/           # Axios instance
│       ├── components/    # Navbar, Footer, ProtectedRoute
│       ├── context/       # AuthContext (login/register/logout)
│       └── pages/         # Home, Login, Register, Dashboard
│
├── server/          # Express backend
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Auth logic
│   ├── middleware/         # JWT verification
│   ├── models/            # Mongoose schemas
│   └── routes/            # API routes
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
npm install
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

The API server starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## API Endpoints

| Method | Route                | Access  | Description          |
| ------ | -------------------- | ------- | -------------------- |
| POST   | `/api/auth/register` | Public  | Create new user      |
| POST   | `/api/auth/login`    | Public  | Authenticate user    |
| GET    | `/api/auth/profile`  | Private | Get user profile     |
| GET    | `/api/health`        | Public  | API health check     |

## Environment Variables

Create a `server/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stryve
JWT_SECRET=your_super_secret_key
```
