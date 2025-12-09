# Apex — Real-time Stock Dashboard

Apex is a personal project: a real-time stock/market dashboard built with Next.js (app router) and Prisma. It includes a frontend (React + Next), a lightweight backend server (in `backend/`) used for socket feeds, and Postgres + Prisma for persistence.

**Quick summary**
- Frontend: Next.js 16 (app directory), React 19, TypeScript
- Backend: simple Node server in `backend/` (socket provider)
- Database: PostgreSQL via Prisma
- Real-time: Socket.io client connects to the backend socket server

## Features
- Real-time market tickers and charts
- User accounts (email/password + Google social provider)
- Watchlist per user, persisted in the database
- Simple transaction model for buy/sell recording

## Tech stack
- Next.js (app router)
- React 19 + TypeScript
- Prisma + PostgreSQL
- Socket.io (real-time updates)
- Tailwind CSS for styling

## Environment
Create a `.env` file in the project root. The project expects at minimum these variables:

- `DATABASE_URL` — Postgres connection string used by Prisma
- `NEXT_PUBLIC_BACKEND_URL` — URL of the backend socket server
- `GOOGLE_CLIENT_ID` — Google OAuth client id (optional if using social login)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (optional)
- `NODE_ENV` — `development` or `production`

Adjust other provider secrets or settings as needed.

## Setup (development)
1. Install dependencies:

```powershell
npm install
```

2. Prepare the database (run migrations or `prisma migrate dev` if you maintain migrations):

```powershell
npx prisma generate
# if you have migrations:
npx prisma migrate dev
```

3. Start the backend socket server (runs `backend/server.js`):

```powershell
npm run backend
```

4. Run the Next.js frontend in development:

```powershell
npm run dev
```

Tip: to run both frontend and backend together use the `dev:all` script:

```powershell
npm run dev:all
```

