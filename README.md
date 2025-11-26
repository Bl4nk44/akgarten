# Garten Service Website

Fast, SEO-friendly gardening service website. Frontend: React + Vite + Tailwind. Backend: Express (contact, AI chat) + admin gallery panel (upload + watermark + thumbnails).

## Features
- Landing sections: Hero, About, Services, Gallery (filters, pagination, Before/After), Contact, Testimonials
- Gallery:
  - Data loaded dynamically from `/api/gallery` (JSON)
  - Thumbnails without watermark (faster grids); served images include a watermark
  - Before/After slider in a lightbox
- Admin panel (/admin):
  - Token-based auth (Bearer ADMIN_TOKEN stored in sessionStorage)
  - Drag’n’drop upload: singles and Before/After pairs
  - Automatic watermark (PNG, bottom-right)
  - Automatic thumbnail generation (no watermark)
  - Edit title/description, delete items
- Contact form (Resend), Chat (OpenAI) with rate limits and security headers (Helmet)
- Production: Docker + reverse proxy, Nginx config for cache and gzip

## Tech Stack
- Frontend: React 18, Vite, TailwindCSS
- Backend: Node/Express, Resend, OpenAI, Helmet, Zod, express-rate-limit, Morgan, Multer, Sharp
- Infra: Docker Compose, Nginx/Proxy Manager

## Environment Variables
Backend (docker-compose or secrets):
- RESEND_API_KEY – Resend API key
- TARGET_EMAIL – target inbox
- OPENAI_API_KEY – OpenAI API key
- ALLOWED_ORIGIN – CORS list (e.g., `https://yourdomain.com,https://www.yourdomain.com`)
- OPENAI_MODEL, OPENAI_FALLBACK_MODEL – chat models
- APP_VERSION – optional version label
- ADMIN_TOKEN – admin panel token (Bearer)

Frontend (build-time):
- VITE_SHOW_ADMIN_LINK=1 – show “Admin” link in footer (hidden by default)

## Local Development
- Root: `npm install`
- Backend: `cd backend && npm install`
- Run backend: `RESEND_API_KEY=... TARGET_EMAIL=... OPENAI_API_KEY=... ALLOWED_ORIGIN=http://localhost:5173 node server.mjs`
- Frontend dev: `npm run dev` (http://localhost:5173)
- In dev, proxy `/api/*` to `http://localhost:3001` (via Vite config)

## Production (Docker Compose)
1) Shared proxy network (one-time): `docker network create services-network`

2) Backend volumes and env (docker-compose):
- volumes:
  - `./public/gallery:/app/public/gallery`
  - `./data:/app/data`
- env: include `ADMIN_TOKEN`

3) Reverse proxy (Nginx Proxy Manager):
- `/` → frontend:80
- `/api/` → backend:3001
- HTTPS + HTTP/2 + HSTS
- For uploads, increase limits: `client_max_body_size 20m`, `proxy_read_timeout 60s` on `/api/`

4) Build and run:
- `docker compose up -d --build`

5) Healthchecks
- `GET /health` → `{ status: "ok" }`
- `GET /api/health` → details (time, version, models, CORS)

## Gallery – adding/managing (recommended)
- Go to `/admin` (enable footer link via `VITE_SHOW_ADMIN_LINK=1` or navigate directly)
- Paste token (ADMIN_TOKEN)
- Tabs:
  - “Add photos” – drag’n’drop multiple files; optional shared title/description
  - “Add pair” – choose before/after + meta
  - “List” – view items (thumbnails), edit title/description, delete
- Backend API updates JSON manifest: `data/gallery.json`. Images are stored in `public/gallery` (thumbnails in `public/gallery/thumbs`).

## Gallery – tooling (manual/advanced)
- Generate thumbnails (max 800px): `npm run thumbs` (scripts/gen-thumbs.mjs)
- Apply watermark to existing images and rebuild thumbs: `npm run watermark` (scripts/watermark-existing.mjs)

Note: the gallery now fetches `/api/gallery`. The legacy `src/data/galleryManifest.ts` is not used by the Gallery component.

## Backend Endpoints (gallery)
- GET `/api/gallery` – public manifest JSON
- GET `/api/admin/list` – list (requires `Authorization: Bearer ADMIN_TOKEN`)
- POST `/api/admin/upload-single` – `file`, `title?`, `description?`
- POST `/api/admin/upload-pair` – `beforeFile`, `afterFile`, `title?`, `description?`
- PATCH `/api/admin/meta/:id` – `{ title, description }` (empty strings clear)
- DELETE `/api/admin/item/:id`

## Scripts
- `npm run dev` – frontend dev server
- `npm run build` – frontend production build
- `npm run lint` – typecheck + test build
- `npm run thumbs` – generate thumbnails
- `npm run watermark` – watermark existing + rebuild thumbs
- `npm run build:manifest` – scan public/gallery → data/gallery.json

## Updating the Server (deployment)
Assuming the repo is on the server and reverse proxy is configured.

1) Set env and flags (once or when changed):
- `.env` (or secrets):
  - `RESEND_API_KEY`, `TARGET_EMAIL`, `OPENAI_API_KEY`, `ALLOWED_ORIGIN`
  - `OPENAI_MODEL`, `OPENAI_FALLBACK_MODEL`, `APP_VERSION`
  - `ADMIN_TOKEN`
  - `VITE_SHOW_ADMIN_LINK=1` (build arg for frontend)

2) Pull new code:
```powershell
git fetch --all
git pull --ff-only
```

3) (Optional) Install tooling deps for scripts:
```powershell
npm ci
```

4) Watermark existing images and rebuild thumbs (one-time migration):
```powershell
npm run watermark
npm run build:manifest
```

5) Build and restart containers (backend already has volumes for `public/gallery` and `data`):
```powershell
docker compose up -d --build
```

6) Reverse proxy tweaks if needed:
- route `/api/` to backend:3001
- add `client_max_body_size 20m`, `proxy_read_timeout 60s`

7) Smoke-test:
```powershell
curl.exe https://yourdomain/api/health
curl.exe https://yourdomain/api/gallery
```
- `/admin` → paste token → upload a test photo → check it appears on the homepage gallery.

## Email & Chat
- POST `/api/send-email` – via Resend
- POST `/api/chat` – OpenAI with retry/degrade

## Security & Logging
- Helmet, Zod, rate-limit, CORS allowlist, morgan with `x-request-id`
- Admin auth: Bearer token (`ADMIN_TOKEN`). For extra hardening, add Basic Auth on `/admin/*` in the proxy.

## License
Proprietary – contact the author for usage terms.
