# Hostinger Deployment Guide

This project ships as one consolidated frontend bundle plus a separate Node.js API backend.

## Folder structure after build

```
hospital-system/dist/
  index.html          <- public website (upload this folder's contents to public_html)
  assets/
  admin/
    index.html        <- admin dashboard at /admin/
  doctor/
    index.html        <- doctor dashboard at /doctor/
  .htaccess           <- Apache SPA routing (Hostinger shared hosting)
```

## Option A: Static frontend on Hostinger (shared hosting)

1. Build the frontend locally:
   ```bash
   cd hospital-system
   npm run install:all
   npm run build
   ```
2. Upload **everything inside** `hospital-system/dist/` to your Hostinger `public_html` folder.
3. Confirm `public_html/index.html` exists — this fixes the 503 "no index file" error.
4. Host the backend API separately (Hostinger Node.js app, VPS, or another service) and set its URL in production if it is not on the same domain.

Navigation links on the public site:
- **Admin Login** → `/admin/login`
- **Doctor Login** → `/doctor/login`

## Option B: Full stack on Hostinger Node.js hosting

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy `backend/` and the built `hospital-system/dist/` folder together.
3. Set environment variables in Hostinger (copy from `backend/.env.example`).
4. Set `NODE_ENV=production` and start the backend:
   ```bash
   cd backend
   npm start
   ```
5. The backend serves:
   - `/api/*` — REST API
   - `/` — public website
   - `/admin/*` — admin dashboard
   - `/doctor/*` — doctor dashboard

## Local development

Run all three frontends from one entry point (public website on port 5174):

```bash
cd hospital-system
npm run install:all
npm run dev
```

Open http://localhost:5174 — Admin and Doctor links proxy to their dashboards on the same origin.

Run the API in a separate terminal:

```bash
cd backend
npm install
npm run dev
```

Preview the production build locally:

```bash
cd hospital-system
npm run build
npm run preview
```

Open http://localhost:5174

## Environment variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `VITE_API_URL` | Frontends | API base URL (defaults to `/api` in production) |
| `VITE_SOCKET_URL` | Doctor dashboard | WebSocket server URL |
| `NODE_ENV` | Backend | Set to `production` when deploying |
| `PORT` | Backend | Server port (Hostinger sets this automatically) |
