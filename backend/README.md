# Portfolio Backend

This backend serves the Express API for the React portfolio frontend with modern username/password auth, single admin registration, and an admin contact dashboard.

## Install

```bash
cd backend
npm install
```

## Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required values:

- `JWT_SECRET` — secure token signing secret

## Run

```bash
npm start
```

## Development

```bash
npm run dev
```

## Endpoints

- `GET /auth/admin-available` — whether admin registration is still allowed
- `POST /auth/register` — register a user or first admin account
- `POST /auth/login` — login with email and password
- `GET /auth/me` — current authenticated user
- `POST /logout` — clear login cookie
- `GET /api/status`
- `GET /api/projects`
- `POST /api/contact` — authenticated contact submissions
- `GET /api/contact/messages` — admin-only inbox
- `POST /api/contact/reply` — admin reply to messages
