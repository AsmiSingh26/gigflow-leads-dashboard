# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and TailwindCSS. Manage your sales pipeline with real-time filtering, role-based access control, and CSV export.

🔗 **Live Demo:** [gigflow-leads-dashboard-tau.vercel.app](https://gigflow-leads-dashboard-tau.vercel.app)  
🔗 **API Base URL:** [gigflow-leads-dashboard-dtul.onrender.com/api](https://gigflow-leads-dashboard-dtul.onrender.com/api)

---

## Features

- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Lead Management** — Full CRUD (create, read, update, delete)
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by latest/oldest — all filters work together
- **Debounced Search** — 500ms debounce to minimize API calls
- **Backend Pagination** — 10 records per page with pagination metadata
- **Role-Based Access Control** — Admin can delete leads; Sales users have read/write access
- **CSV Export** — Download all leads as a CSV file
- **Docker Support** — Full Docker Compose setup for local development
- **Responsive UI** — Works on mobile and desktop

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite |
| Backend   | Node.js, Express.js, TypeScript     |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT, bcrypt                         |
| Deploy    | Vercel (frontend), Render (backend) |

---

## Project Structure

```
gigflow-leads-dashboard/
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instances & API functions
│   │   │   ├── axios.ts
│   │   │   ├── auth.api.ts
│   │   │   └── leads.api.ts
│   │   ├── components/       # Reusable components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── types/            # TypeScript interfaces
│   │   │   └── index.ts
│   │   └── main.tsx
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection
│   │   │   └── database.ts
│   │   ├── controllers/      # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── lead.controller.ts
│   │   ├── middleware/       # Auth & role middleware
│   │   │   └── auth.middleware.ts
│   │   ├── models/           # Mongoose models
│   │   │   ├── Lead.model.ts
│   │   │   └── User.model.ts
│   │   ├── routes/           # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   └── lead.routes.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/AsmiSingh26/gigflow-leads-dashboard.git
cd gigflow-leads-dashboard
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Running with Docker

```bash
# From the root directory
cp backend/.env.example backend/.env
# Fill in your env values, then:
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                        | Required |
|-----------------|------------------------------------|----------|
| `PORT`          | Server port (default: 5000)        | No       |
| `MONGODB_URI`   | MongoDB connection string          | Yes      |
| `JWT_SECRET`    | Secret key for JWT signing         | Yes      |
| `JWT_EXPIRES_IN`| JWT expiry duration (e.g. `7d`)    | Yes      |
| `NODE_ENV`      | `development` or `production`      | No       |

### Frontend (`frontend/.env`)

| Variable        | Description              | Required |
|-----------------|--------------------------|----------|
| `VITE_API_URL`  | Backend API base URL     | Yes      |

---

## Roles

| Role    | Permissions                              |
|---------|------------------------------------------|
| `admin` | Create, read, update, delete leads       |
| `sales` | Create, read, update leads (no delete)   |

Select your role during registration.

---

## Deployment

- **Frontend** deployed on [Vercel](https://vercel.com) — auto-deploys on push to `main`
- **Backend** deployed on [Render](https://render.com) — auto-deploys on push to `main`
- **Database** hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
