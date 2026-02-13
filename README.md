# Resume Platform (Free-Tier Only, Production-Ready)

Real-time collaborative resume builder with autosave, version history, markdown + rich-text editing, and PDF export.

## Free-Tier Policy (Locked)

This platform is **free-tier-only** by design.

No paid plans, upgrade paths, billing, or Stripe logic are implemented.

### Enforced Limits

- AI analysis: `10` requests per user per UTC day
- Resumes: `3` owned resumes per user
- Version history: `20` versions per resume
- Collaborators: `2` non-owner collaborators per resume

### Reset Semantics

- AI quota resets at **00:00 UTC** daily.
- Resume/version/collaborator limits are persistent caps until data is removed.

### Standard Quota Error Contract

When a free-tier limit is exceeded, APIs return HTTP `429`:

```json
{
  "error": "Daily AI analysis limit reached for free tier",
  "code": "FREE_TIER_LIMIT_REACHED",
  "resource": "aiAnalysis",
  "limit": 10,
  "current": 10,
  "resetAtUtc": "2026-02-12T00:00:00.000Z"
}
```

`resource` can be one of:
- `aiAnalysis`
- `resumes`
- `versions`
- `collaborators`

## Monorepo Layout

- `apps/api` - Node.js/TypeScript backend (REST + WebSocket)
- `apps/web` - Vite/React frontend
- `packages/shared` - shared types/utilities
- `.github/workflows` - CI pipeline

## Tech Stack

- Frontend: React + Vite + TipTap + Yjs + Zustand
- Backend: Node.js + Express + Prisma + PostgreSQL + y-websocket
- Quality: ESLint + Prettier + Husky + Conventional Commits
- DevOps: Docker + docker-compose + GitHub Actions

## Architecture Overview

- REST API handles authentication, resume CRUD, versioning, collaborators, and quota usage.
- WebSocket server handles collaborative live editing and synchronization.
- PostgreSQL persists users, resumes, versions, collaborators, refresh tokens, and daily AI usage.

```mermaid
flowchart LR
  UI["Web App (React/Vite)"] -- "REST" --> API["API Server (Express)"]
  UI -- "WebSocket" --> WS["Collab Server (y-websocket)"]
  API --> DB[(PostgreSQL)]
  WS --> DB
```

### Diagram Explanation

- The UI writes structured resume content via REST and receives quota metadata from `/api/usage/free-tier`.
- Real-time editing traffic is isolated to WebSocket collaboration channels.
- API business-layer guards enforce free-tier quotas before mutations/AI calls succeed.

## API Contract: Free-Tier Usage

### `GET /api/usage/free-tier`

Requires authentication (`Bearer <accessToken>`).

Optional query:
- `resumeId` (UUID): includes active-resume usage fields.

Response:

```json
{
  "limits": {
    "aiPerDay": 10,
    "resumesPerUser": 3,
    "versionsPerResume": 20,
    "collaboratorsPerResume": 2
  },
  "usage": {
    "aiUsedToday": 2,
    "resumesUsed": 1,
    "versionsUsedForActiveResume": 4,
    "collaboratorsUsedForActiveResume": 1
  },
  "resetAtUtc": "2026-02-12T00:00:00.000Z"
}
```

## Local Development

### 1) Environment Variables

Backend (`apps/api/.env`):

```dotenv
NODE_ENV=development
PORT=4000
COLLAB_PORT=4001
DATABASE_URL=postgresql://resume:resume_dev@localhost:5432/resume_dev
JWT_ACCESS_SECRET=change_me_access_secret_please_use_32_chars_min
JWT_REFRESH_SECRET=change_me_refresh_secret_please_use_32_chars_min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=200
GROQ_API_KEY=
ENABLE_API_SERVER=true
ENABLE_COLLAB_SERVER=true
```

Frontend (`apps/web/.env`):

```dotenv
VITE_API_BASE_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4001
```

Notes:
- Keep Groq key backend-only.
- Supabase keys may remain in dotenv but are intentionally unused in free-tier mode unless explicitly integrated later.
- Production default behavior:
  - If `VITE_API_BASE_URL` is omitted, frontend falls back to `/api`.
  - If `VITE_WS_URL` is omitted, frontend derives WebSocket base from current host.

## Endpoint Mapping (Deploy)

- API base URL:
  - frontend key: `VITE_API_BASE_URL`
  - format: `https://api.yourdomain.com/api`
- Collaboration WebSocket:
  - frontend key: `VITE_WS_URL`
  - format: `wss://ws.yourdomain.com`
- CORS origins:
  - backend key: `CORS_ORIGIN`
  - format: comma-separated origins
  - example: `https://app.yourdomain.com,https://admin.yourdomain.com`

## Breakpoints and Layout Stability

- Tailwind breakpoint coverage:
  - mobile (`<640px`)
  - tablet (`>=768px`)
  - desktop (`>=1024px`)
  - wide desktop (`>=1280px`)
- Resume editor uses editor-first layout with adaptive utility panels for better UX across breakpoints.

### 2) Install Dependencies

```bash
npm install
```

### 3) Database Migration + Seed

```bash
npm run -w apps/api prisma:migrate
npm run -w apps/api prisma:seed
```

### 4) Start Services

```bash
npm run dev
```

## Docker (Local)

```bash
docker-compose up --build
```

## Docker (Production Template)

1. Copy templates:
```bash
cp .env.production.example .env.production
cp apps/api/.env.production.example apps/api/.env.production
cp apps/web/.env.production.example apps/web/.env.production
```
2. Fill production secrets/domains.
3. Run:
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

## Production Build

```bash
npm run build
```

## Deployment Guide (High-Level)

1. Provision PostgreSQL and networking.
2. Build and push backend/frontend Docker images.
3. Apply Prisma migrations before switching traffic.
4. Deploy API and frontend services.
5. Set required environment variables per environment.
6. Verify free-tier usage endpoint and quota enforcement post-deploy.

### Render Deployment (Recommended)

Render is a suitable choice for this stack (React static frontend + Node API + PostgreSQL + WebSockets), especially since you already have an account.

Important: Render exposes one public port per service, so deploy backend as **two services**:
- API service
- Collaboration WebSocket service

#### 1) Create PostgreSQL on Render
- Create a managed PostgreSQL instance.
- Copy the internal database URL for `DATABASE_URL`.

#### 2) Deploy API service (`apps/api`)
- Type: Web Service (Node)
- Root directory: `apps/api`
- Build command: `npm install && npm run build`
- Start command: `ENABLE_COLLAB_SERVER=false npm run start`
- Required env:
  - `NODE_ENV=production`
  - `DATABASE_URL=<render-postgres-url>`
  - `JWT_ACCESS_SECRET=<32+ chars>`
  - `JWT_REFRESH_SECRET=<32+ chars>`
  - `JWT_ACCESS_EXPIRES_IN=15m`
  - `JWT_REFRESH_EXPIRES_IN=7d`
  - `CORS_ORIGIN=<your-frontend-url>`
  - `ENABLE_API_SERVER=true`
  - `ENABLE_COLLAB_SERVER=false`
  - `GROQ_API_KEY=<optional>`

#### 3) Deploy WS collaboration service (`apps/api`)
- Type: Web Service (Node)
- Root directory: `apps/api`
- Build command: `npm install && npm run build`
- Start command: `COLLAB_PORT=$PORT ENABLE_API_SERVER=false ENABLE_COLLAB_SERVER=true npm run start`
- Required env:
  - `NODE_ENV=production`
  - `DATABASE_URL=<render-postgres-url>`
  - `JWT_ACCESS_SECRET=<same-as-api>`
  - `JWT_REFRESH_SECRET=<same-as-api>`
  - `CORS_ORIGIN=<your-frontend-url>`
  - `ENABLE_API_SERVER=false`
  - `ENABLE_COLLAB_SERVER=true`

#### 4) Deploy frontend (`apps/web`)
- Type: Static Site
- Root directory: `apps/web`
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Required env:
  - `VITE_API_BASE_URL=https://<api-service>.onrender.com/api`
  - `VITE_WS_URL=wss://<ws-service>.onrender.com`

#### 5) Apply migrations
- Run once against production DB:
```bash
cd apps/api
DATABASE_URL=<render-postgres-url> npx prisma migrate deploy
```

#### 6) Final checks
- API health: `https://<api-service>.onrender.com/api/health`
- Login works
- Resume editor loads
- WebSocket live collaboration connects

### Production Env Templates

- Backend: `apps/api/.env.production.example`
- Frontend: `apps/web/.env.production.example`

### GitHub Push Steps

1. Create a new repository on GitHub.
2. Add remote:
```bash
git remote add origin https://github.com/<your-user>/<your-repo>.git
```
3. Commit:
```bash
git add .
git commit -m "chore: deployment hardening and endpoint configuration updates"
```
4. Push:
```bash
git push -u origin main
```

## CI/CD Pipeline

GitHub Actions executes:
- Lint
- Test
- Free-tier quota regression tests
- Build
- Docker image build
- Deploy placeholder step

## Security Highlights

- JWT access + refresh token flow
- HTTP-only refresh cookies
- Helmet + strict CORS
- Rate limiting
- Input sanitization
- Authenticated WebSocket sessions
- Backend-only AI key handling

## Troubleshooting Free-Tier Limits

- `429 FREE_TIER_LIMIT_REACHED` on AI analysis:
  - Check `resetAtUtc` and retry after UTC reset.
- `429` on resume/version/collaborator actions:
  - Reduce existing resources before retrying.
- UI not reflecting latest usage:
  - Refresh session or trigger a usage-refresh action (resume create/version save/collaborator add/AI analyze).

## Breaking-Change Migration Notes

- Added usage API: `GET /api/usage/free-tier`.
- Added quota error payload contract for HTTP `429`.
- Added `DailyUsage` model for AI daily counters.
- Collaborator create/update roles are restricted to `editor` and `viewer` (owner remains system-managed).
