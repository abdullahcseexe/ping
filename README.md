# Ping

Ping is a real-time chat application with a mobile app (Expo/React Native), a web client (React + Vite), and a shared backend (Bun + Express + Socket.IO + MongoDB). It supports user authentication, one-on-one chats, real-time messaging, online presence, and typing indicators.

## Tech Stack

- **Backend:** Bun, Express 5, Socket.IO, Mongoose (MongoDB), Clerk (authentication)
- **Web:** React 19, Vite, Clerk React
- **Mobile:** Expo / React Native, Zustand, TanStack Query, Socket.IO client, Sentry

## Project Structure

```
ping-main/
├── backend/     # Express + Socket.IO API server
├── web/         # React (Vite) web client
└── mobile/      # Expo React Native app
```

### Backend (`backend/`)

- `index.ts` – entry point; starts the HTTP server, connects to MongoDB, and initializes Socket.IO
- `src/app.ts` – Express app setup (CORS, Clerk middleware, routes, error handling)
- `src/routes/` – API routes for auth, chats, messages, and users
- `src/controllers/` – request handlers for each route group
- `src/models/` – Mongoose schemas (`User`, `Chat`, `Message`)
- `src/middleware/` – authentication and error-handling middleware
- `src/utils/socket.ts` – Socket.IO setup (online users, typing indicators, real-time messages)
- `src/config/database.ts` – MongoDB connection

#### API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/callback` | Sync Clerk user with the database |
| GET | `/api/chats` | List chats for the current user |
| POST | `/api/chats/with/:participantId` | Get or create a chat with another user |
| GET | `/api/messages/chat/:chatId` | Get messages for a chat |
| DELETE | `/api/messages/:messageId` | Delete a message |
| GET | `/api/users` | List users |
| DELETE | `/api/users/me` | Delete current user |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A MongoDB database (local or hosted, e.g. MongoDB Atlas)
- A [Clerk](https://clerk.com) account for authentication keys

### Backend

```bash
cd backend
bun install
bun run dev    # starts the server with hot-reload on PORT (default 3000)
```

Required environment variables (`.env` in `backend/`):

```
PORT=3000
MONGODB_URI=<your MongoDB connection string>
CLERK_SECRET_KEY=<your Clerk secret key>
FRONTEND_URL=<production frontend URL, for CORS>
```

### Web

```bash
cd web
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

The mobile app's API and Socket.IO base URLs are configured in `mobile/lib/axios.ts` and `mobile/lib/socket.ts`.

## Deployment

The backend is deployed independently (e.g. on Sevalla/Railway) and exposed via a public URL. Both the web and mobile clients are configured to communicate with this deployed backend over HTTPS/WSS, so they don't depend on any local machine being online.

In production, the backend can also serve the built web client as static files (see `src/app.ts`).

## Features

- User authentication via Clerk
- One-on-one real-time chat
- Live message delivery via Socket.IO
- Online/offline presence indicators
- Typing indicators
- Message deletion
