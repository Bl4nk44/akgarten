# AK Garten Service Website

A fast, SEO-friendly website for a gardening service business. Built with React + Vite, TailwindCSS, and an Express backend (email + AI chat). Production is served via Nginx with a reverse proxy (e.g., Nginx Proxy Manager).

## Features
- Responsive landing page (Hero, Services, Gallery, Contact)
- Gallery with filters, pagination, and Before/After slider
  - Retina-optimized images via `srcSet/sizes`
  - Lightweight thumbnails generated with Sharp
- Contact form (sends email via Resend)
- AI Chatbot (OpenAI) with safe server-side API
- Hardened backend: Helmet, rate limiting, schema validation (Zod), CORS allowlist, x-request-id + request logging (morgan)
- Static site served by Nginx with gzip and long-lived cache for assets

## Tech Stack
- Frontend: React 18, Vite, TailwindCSS, React Markdown (for bot replies)
- Backend: Node.js (Express), Resend (email), OpenAI (chat), Helmet, Zod, express-rate-limit, Morgan
- Infra: Docker + docker-compose, Nginx, Nginx Proxy Manager (reverse proxy)

## Prerequisites
- Node.js 18+
- Docker + Docker Compose (for production setup)
- Nginx Proxy Manager (or any reverse proxy) for https and routing `/api/*` to backend
- Resend account and verified sender domain
- OpenAI API key

## Environment Variables (Backend)
Set these for the backend service:
- `RESEND_API_KEY` – your Resend API key
- `TARGET_EMAIL` – where contact form emails should be delivered
- `OPENAI_API_KEY` – OpenAI API key
- `ALLOWED_ORIGIN` – comma-separated list of allowed origins for CORS (e.g. `https://akgarten.com,https://www.akgarten.com`)

## Local Development
You can run frontend (Vite) and backend (Express) separately during development.

1) Install dependencies
- Frontend (root):
  - `npm install`
- Backend (in `./backend`):
  - `npm install`

2) Run backend locally
- From `./backend`:
  - `RESEND_API_KEY=... TARGET_EMAIL=... OPENAI_API_KEY=... ALLOWED_ORIGIN=http://localhost:5173 node server.mjs`
  - Backend runs on `http://localhost:3001`

3) Run frontend (root)
- `npm run dev`
- Frontend runs on `http://localhost:5173`
- The frontend calls `/api/*` (relative). In dev, set up a reverse proxy (e.g., NPM) to forward `http://localhost:5173/api/*` to `http://localhost:3001/api/*`, or temporarily point the fetch URLs to `http://localhost:3001`.

## Production (Docker Compose)
1) Ensure a shared Docker network for the reverse proxy (NPM) and services:
- `docker network create services-network`

2) Configure Nginx Proxy Manager (or your reverse proxy) for the domain (e.g., `akgarten.com`)
- Forward `/` to the `frontend` container (port 80)
- Forward `/api/` to the `backend` container (port 3001)
- Enable HTTPS (Let’s Encrypt), HTTP/2, HSTS

3) Set environment variables for backend in `docker-compose.yml` or your secret store
- `RESEND_API_KEY`, `TARGET_EMAIL`, `OPENAI_API_KEY`, `ALLOWED_ORIGIN`
- `OPENAI_MODEL` (recommended: `gpt-5`), `OPENAI_FALLBACK_MODEL` (recommended: `gpt-4.1`)
- `APP_VERSION` (optional string to expose in `/api/health`)

4) Build and run
- `docker compose up -d --build`

5) Health endpoints
- Basic: `GET /health` → `{ status: "ok" }`
- Extended: `GET /api/health` → `{ status, time, uptimeSec, version, models: { primary, fallback }, cors: { allowedOrigins } }`

The provided `nginx.conf` already enables gzip and long-lived caching for static assets.

## Gallery: How to Add Images
Images live in `public/gallery`. The component uses a manifest for ordering and metadata.

- Regular images (29 total):
  - Place files as `/public/gallery/gal-001.jpg` ... `/public/gallery/gal-029.jpg`
- Before/After pairs (7 pairs):
  - Place files as `/public/gallery/pairs/pair-01-before.jpg` and `/public/gallery/pairs/pair-01-after.jpg` ... up to `pair-07-*`
- Thumbnails (recommended for performance):
  - Generate to `/public/gallery/thumbs/*` with a `.thumb` suffix, e.g. `gal-001.thumb.jpg`, `pairs/pair-01-after.thumb.jpg`

Update the manifest file `src/data/galleryManifest.ts`:
- `singleImages`: add `{ id: 'gal-001', src: '/gallery/gal-001.jpg', thumb?: '/gallery/thumbs/gal-001.thumb.jpg', title?, description? }`
- `beforeAfterPairs`: add `{ id: 'pair-01', before: { src, thumb? }, after: { src, thumb? }, title?, description? }`

Thumbnails are optional. If not provided, the gallery will infer their paths based on the original file name and use them if found.

### Generate Thumbnails (Sharp)
A simple script generates thumbnails at max width 800px:
- `npm run thumbs`
- Script: `scripts/gen-thumbs.mjs`
- Output goes to `/public/gallery/thumbs/...` mirroring the source structure

## Email (Resend)
- Backend endpoint: `POST /api/send-email`
- Requires a verified sender domain in Resend (the `from` address must match)

## AI Chat (OpenAI)
- Backend endpoint: `POST /api/chat`
- Frontend ChatBot calls `/api/chat`
- Server enforces limits and validation; the model can be adjusted in `backend/server.mjs`

## Security & Logging
- Helmet for security headers
- CORS allowlist via `ALLOWED_ORIGIN`
- Rate limiting on `/api/send-email` and `/api/chat`
- Request IDs and structured access logs (morgan)

## Nginx (Static Site)
`nginx.conf` includes:
- Gzip compression
- Long-lived cache for static assets (immutable)
- Safe defaults for content type and referrer policy

## Scripts
- `npm run dev` – start Vite dev server (frontend)
- `npm run build` – production build (frontend)
- `npm run lint` – typecheck + test build
- `npm run thumbs` – generate gallery thumbnails with Sharp

## Deployment Checklist
- DNS → points to reverse proxy host
- Reverse Proxy → routes `/` to frontend:80 and `/api/` to backend:3001; add:
  - `client_max_body_size 10m`, `proxy_read_timeout 60s` on `/api/`
- Backend env → set: `RESEND_API_KEY`, `TARGET_EMAIL`, `OPENAI_API_KEY`, `ALLOWED_ORIGIN`, `OPENAI_MODEL`, `OPENAI_FALLBACK_MODEL`, optional `APP_VERSION`
- Build & Deploy → `docker compose up -d --build`
- Verify:
  - `curl https://yourdomain/api/health`
  - `curl -X POST https://yourdomain/api/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"ping"}]}'`
- Logging → `docker compose logs -f backend` (check `x-request-id` correlation)

### Smoke-test (one-liner)
- Health + Chat in one go (expects 200 for health and text in chat):
  - `curl -s https://yourdomain/api/health | jq && curl -s -X POST https://yourdomain/api/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"ping"}]}' | jq`

## Notes
- The Contact section includes a seasonal garden calendar widget on the left.
- The Before/After gallery opens with the slider at 0% (all "Before") and animates to 100% (shows "After").

## Google Business Profile (Reviews) – Coming Soon
Once the Google Business Profile is created and verified, we will:
- Embed a reviews widget or fetch reviews via an API (depending on your preferred provider)
- Display the review summary and selected latest reviews in the footer or a dedicated section
- Add structured data (Schema.org `LocalBusiness` and `AggregateRating`) for better SEO

## License
Proprietary – contact the author for usage terms.
