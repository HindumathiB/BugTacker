# Mini Bug Tracker

A full-stack bug tracking application built with React 19 + TypeScript on the frontend and Node.js + Express + TypeScript + MongoDB on the backend.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [MongoDB Setup](#mongodb-setup)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Seeding the Database](#seeding-the-database)
- [Default Login Credentials](#default-login-credentials)
- [REST API Reference](#rest-api-reference)
- [Docker Setup](#docker-setup)
- [Screenshots](#screenshots)

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, React Router, Axios, plain CSS

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, dotenv, CORS

## Folder Structure

```
bug-tracker/
├── backend/
│   ├── src/
│   │   ├── config/        # env loader, DB connection
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── middleware/    # auth guard, error handler
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   ├── services/      # business logic
│   │   ├── types/         # shared TypeScript types
│   │   ├── seed/          # database seed script
│   │   ├── app.ts         # Express app factory
│   │   └── server.ts      # entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # reusable UI components
│   │   ├── pages/         # route-level screens
│   │   ├── hooks/         # useAuth, useBugs
│   │   ├── services/      # axios API clients
│   │   ├── types/         # shared TypeScript types
│   │   ├── layouts/       # MainLayout, ProtectedRoute
│   │   ├── styles/        # global.css (design tokens)
│   │   └── utils/         # validators, constants
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local install, or use the provided Docker Compose setup)
- Docker & Docker Compose (optional, for containerized setup)

## Project Setup

Clone or copy the project, then install dependencies for both apps:

```bash
cd bug-tracker/backend
npm install

cd ../frontend
npm install
```

## MongoDB Setup

**Option A — Local MongoDB**

Install MongoDB Community Edition and ensure it's running on `mongodb://127.0.0.1:27017`.

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option B — Docker**

```bash
docker run -d --name bug-tracker-mongo -p 27017:27017 mongo:7
```

**Option C — MongoDB Atlas**

Create a free cluster at https://www.mongodb.com/atlas and use the provided connection string as `MONGO_URI`.

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and adjust values:

```
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/bug-tracker
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173

SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@test.com
SEED_ADMIN_PASSWORD=Admin@123
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5050/api
```

## Running the Backend

```bash
cd backend
npm run dev
```

The API starts on `http://localhost:5050`. Health check available at `GET http://localhost:5050/health`.

> **Port already in use?** Set `PORT` to any free port in `backend/.env` and update `VITE_API_BASE_URL` in `frontend/.env` to match (e.g. macOS's AirPlay Receiver commonly occupies port `5000`, which is why this project defaults to `5050`).

For production:

```bash
npm run build
npm start
```

## Running the Frontend

```bash
cd frontend
npm run dev
```

The app starts on `http://localhost:5173`.

For production build:

```bash
npm run build
npm run preview
```

## Seeding the Database

Run this once after setting up MongoDB and the backend `.env` file:

```bash
cd backend
npm run seed
```

This clears existing `users` and `bugs` collections and inserts:

- 1 admin user
- 5 sample bugs

## Default Login Credentials

| Field    | Value            |
|----------|------------------|
| Email    | admin@test.com   |
| Password | Admin@123        |

## REST API Reference

| Method | Endpoint             | Auth Required | Description              |
|--------|-----------------------|:-------------:|---------------------------|
| GET    | `/health`             | No            | Health check              |
| POST   | `/api/auth/login`     | No            | Authenticate and get JWT  |
| GET    | `/api/bugs`           | Yes           | List all bugs + stats     |
| GET    | `/api/bugs/:id`       | Yes           | Get a single bug          |
| POST   | `/api/bugs`           | Yes           | Create a bug              |
| PUT    | `/api/bugs/:id`       | Yes           | Update a bug              |
| DELETE | `/api/bugs/:id`       | Yes           | Delete a bug              |

Authenticated requests must include:

```
Authorization: Bearer <token>
```

### Example: Login

```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123"}'
```

### Example: Health Check

```bash
curl http://localhost:5050/health
# {"status":"UP"}
```

## Docker Setup

Run the entire stack (MongoDB + backend + frontend) with Docker Compose:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5050
- MongoDB: mongodb://localhost:27017

After the containers are up, seed the database by running the seed script inside the backend container:

```bash
docker compose exec backend npm run seed
```

To stop everything:

```bash
docker compose down
```

To also remove the MongoDB volume:

```bash
docker compose down -v
```

## Deployment (Render + Vercel)

This deploys the backend to Render and the frontend to Vercel, backed by a MongoDB Atlas cluster (Render does not host MongoDB itself).

### 1. Create a MongoDB Atlas cluster

1. Sign up at https://www.mongodb.com/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) since Render's outbound IPs aren't static on the free plan.
4. Get the connection string from **Connect → Drivers**, it looks like:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bug-tracker?retryWrites=true&w=majority`

### 2. Deploy the backend to Render

**Option A — Blueprint (uses the included `render.yaml`)**

1. Push this repo to GitHub (already done).
2. In the Render dashboard: **New → Blueprint**, select this repo. Render reads `render.yaml` at the repo root and creates the `bug-tracker-backend` web service with `rootDir: backend`.
3. You'll be prompted to fill in the vars marked `sync: false`: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `SEED_ADMIN_PASSWORD`.

**Option B — Manual web service**

1. In the Render dashboard: **New → Web Service**, connect this repo.
2. Root Directory: `backend`
3. Runtime: Node
4. Build Command: `npm install --include=dev && npm run build`
   (the `--include=dev` matters — `typescript` is a devDependency and Render can otherwise skip it)
5. Start Command: `npm start`
6. Health Check Path: `/health`
7. Add environment variables:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random string
   - `JWT_EXPIRES_IN` — `1d`
   - `CORS_ORIGIN` — leave as `http://localhost:5173` for now; you'll update it once the Vercel URL exists (step 4)
   - `SEED_ADMIN_NAME` — `Admin`
   - `SEED_ADMIN_EMAIL` — `admin@test.com`
   - `SEED_ADMIN_PASSWORD` — `Admin@123`

   Do **not** set `PORT` — Render injects it automatically and the app already reads `process.env.PORT`.

Once deployed, Render gives you a URL like `https://bug-tracker-backend.onrender.com`. Confirm it's alive:

```bash
curl https://bug-tracker-backend.onrender.com/health
# {"status":"UP"}
```

### 3. Seed the production database

Open the **Shell** tab on the Render service and run:

```bash
npm run seed:prod
```

This runs the compiled `dist/seed/seed.js` (no `ts-node` needed at runtime) and inserts the admin user + 5 sample bugs.

### 4. Deploy the frontend to Vercel

1. In the Vercel dashboard: **Add New → Project**, import this repo.
2. Root Directory: `frontend` (Vercel auto-detects the Vite framework preset once you set this).
3. Build Command: `npm run build` (default), Output Directory: `dist` (default).
4. Add an environment variable:
   - `VITE_API_BASE_URL` = `https://bug-tracker-backend.onrender.com/api` (use your actual Render URL)
5. Deploy. Vercel gives you a URL like `https://bug-tracker.vercel.app`.

The included `frontend/vercel.json` adds a catch-all rewrite to `index.html`, which is required for React Router's client-side routes (e.g. `/dashboard`, `/bugs/:id`) to work on direct load/refresh instead of 404ing.

### 5. Close the loop: update CORS on the backend

Now that you have the final Vercel URL, go back to the Render service's environment variables and update:

```
CORS_ORIGIN=https://bug-tracker.vercel.app
```

(Comma-separate multiple origins if needed, e.g. to also allow `http://localhost:5173` for local testing against the deployed API.) Save — Render redeploys automatically. Then log in at your Vercel URL with `admin@test.com` / `Admin@123`.

> **Note on Render's free tier:** free web services spin down after ~15 minutes of inactivity and take 30–60 seconds to wake up on the next request — the first login attempt after idle time may time out or feel slow. This is expected on the free plan, not a bug.

## Screenshots

> Replace these placeholders with actual screenshots once the app is running.

### Login Page
`docs/screenshots/login.png`

### Dashboard
`docs/screenshots/dashboard.png`

### Create Bug
`docs/screenshots/create-bug.png`

### Bug Details
`docs/screenshots/bug-details.png`

### Edit Bug
`docs/screenshots/edit-bug.png`

## Application Routes

| Route              | Screen        | Protected |
|--------------------|---------------|:---------:|
| `/login`           | Login         | No        |
| `/dashboard`        | Dashboard     | Yes       |
| `/bugs/create`      | Create Bug    | Yes       |
| `/bugs/:id`         | Bug Details   | Yes       |
| `/bugs/edit/:id`    | Edit Bug      | Yes       |

## Notes for QA / Selenium Automation

- All interactive elements (inputs, buttons) have stable, unique `id` attributes (e.g. `loginBtn`, `email`, `password`, `createBugBtn`, `title`, `severity`, `priority`, `status`, `logoutBtn`).
- Key containers also expose `data-testid` attributes (e.g. `bug-table`, `bug-row-<id>`, `login-error`).
- Routes are static and meaningful (no dynamically generated path segments besides the MongoDB `_id`).
