# NetMind AI

NetMind AI is a React 18 + Vite network operations workspace with a five-part product landing page, JWT authentication, Zod form validation, role-based dashboards, and a Node.js/Express API backed by MongoDB Atlas.

## Stack
- Frontend: React, React DOM, Vite, React Router, React Hook Form, Zod, Lucide icons.
- Backend: Node.js, Express, Mongoose, Zod, bcrypt, JWT, Helmet, CORS and rate limiting.
- Database: MongoDB Atlas database `netmind_ai`; collections `users`, `assets`, `incidents`, `policies`, `audit_logs` (explicitly mapped in the Mongoose model).

## Run locally (Windows PowerShell)
1. Create a MongoDB Atlas database user with readWrite on `netmind_ai`, and add your IP under Atlas Network Access.
2. Copy root `.env.example` to `.env`. Replace the Atlas password and set a unique JWT secret and bootstrap admin password.
3. Start the API:
```powershell
cd backend
npm install
npm run dev
```
4. In a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
5. Open http://localhost:5174. API health: http://localhost:8001/api/health.

The first backend startup creates the administrator specified by BOOTSTRAP_ADMIN_* only if that username/email does not already exist. Keep the root .env private. Never paste credentials into source files or commit them.

## Stakeholder permissions
- **Admin:** full user administration and create/read/update/delete permissions across users, assets, incidents and policies.
- **Analyst:** read/create/update assets, incidents and policies; read audit history; no destructive deletes or user administration.
- **Viewer:** read-only access to dashboard, assets, incidents and policies.

Permissions are enforced in the API, not only hidden in the React sidebar. Public registration only allows Analyst or Viewer. Administrator bootstrap is environment-controlled.

## Main API
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST/PATCH/DELETE /api/assets`
- `GET/POST/PATCH/DELETE /api/incidents`
- `GET/POST/PATCH/DELETE /api/policies`
- `GET/POST/PATCH/DELETE /api/users` (admin only)
- `GET /api/dashboard`, `GET /api/audit-logs`, `GET /api/health`

The former FastAPI implementation remains under `backend/app/` as legacy reference code; the active Docker/API runtime is the Node service under `backend/src/`.

## Operational truth
This application provides network operations inventory and workflows. It does not claim to detect confirmed intrusions or automatically repair physical network adapters. The current incident records are operator-managed; do not treat them as verified threat intelligence.
