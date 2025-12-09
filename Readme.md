# Apex — Real-time Stock Dashboard

Apex is a personal project demonstrating a full-stack, real-time market dashboard. It features a Next.js App Router frontend, a dedicated Node.js socket server for live market feeds, and a robust PostgreSQL database managed via Prisma.

## ⚡ Features
- **Real-time Updates:** Market tickers and stock values pulse and update every second via Socket.io.

- **Secure Authentication:** Support for Google OAuth and standard Email/Password login.

- **Personal Watchlist:** Users can star stocks to build a persistent portfolio saved in the database.

- **Interactive Charts:** Dynamic visualization with toggleable graph styles (Line, Area, Bar).

- **Transaction Model:** Built-in structure for recording buy/sell actions.

🛠️ Tech Stack
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS

- Backend: Node.js (Express/Http server for sockets)

- Real-time: Socket.io

- Database: PostgreSQL, Prisma ORM

## 🚀 Usage Flow
- **Sign In & Get Started 🔐:** Log in effortlessly using your Google account or create a secure account with email and password. 
- You will land immediately on your personal Dashboard.

- **Build Your Portfolio:** Your dashboard starts as a empty ("No stocks watched").
- Click the **"Browse Explore"** button to enter the market view and find assets to track.

### Adding Stocks:

- On the Explore Page, you can see everything the market has to offer.

- Hover over any stock card to reveal instant details.

- Click the **Star (⭐) icon** on any card to "Watch" that stock and pin it to your Dashboard.

- **Real-Time Tracking ⚡** Head back to your Dashboard. Your starred stocks are now live!.
- Watch their values pulse and update every second via our real-time socket connection.

- **Deep Dive Analysis 📈 Want more data?** Click on any stock in your list to open the detailed graph view. Customize your view by toggling between:

    - Line Graph (Default)

    - Area Chart

    - Bar Chart

## Environment
Create a `.env` file in the project root. The project expects at minimum these variables:

- `DATABASE_URL` — Postgres connection string used by Prisma
- `NEXT_PUBLIC_BACKEND_URL` — URL of the backend socket server
- `GOOGLE_CLIENT_ID` — Google OAuth client id (optional if using social login)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (optional)
- `NODE_ENV` — `development` or `production`

Adjust other provider secrets or settings as needed.

## 📦 Setup (development)
1. Install dependencies:

```powershell
npm install
```

2. Prepare the database Run migrations to set up your PostgreSQL schema:

```powershell
npx prisma generate

npx prisma migrate dev
```

3. Start the backend socket server This runs the lightweight server located in backend/server.js:

```powershell
npm run backend
```

4. Run the Next.js frontend

```powershell
npm run dev
```

💡 Pro Tip: To run both the frontend and backend concurrently in a single terminal, use:

```powershell
npm run dev:all
```

