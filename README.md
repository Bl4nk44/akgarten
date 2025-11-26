# Garten Service Website

Szybka, SEO-friendly strona dla firmy ogrodniczej. Front: React + Vite + Tailwind. Backend: Express (kontakt, czat AI) + teraz panel admina do galerii (upload + watermark + miniatury).

## Co jest na pokładzie
- Strona: Hero, About, Services, Gallery (filtry, paginacja, Before/After), Contact, Testimonials
- Galeria:
  - Dane ładowane dynamicznie z `/api/gallery` (JSON)
  - Miniatury bez znaku wodnego (szybsze siatki), obraz serwowany z watermarkiem
  - Slider Before/After w lightboksie
- Panel admina (/admin):
  - Autoryzacja tokenem (Bearer ADMIN_TOKEN w sessionStorage)
  - Drag’n’drop upload: pojedyncze zdjęcia i pary Before/After
  - Automatyczny watermark (PNG w prawym-dolnym rogu)
  - Miniatury generowane automatycznie (bez watermarku)
  - Edycja tytułu/opisu, usuwanie elementów
- Formularz kontaktowy (Resend), Chat (OpenAI) z rate-limitami i hełmami (Helmet)
- Produkcja: Docker + reverse proxy, Nginx conf do cache i gzip

## Stos
- Frontend: React 18, Vite, TailwindCSS
- Backend: Node/Express, Resend, OpenAI, Helmet, Zod, rate-limit, Morgan, Multer, Sharp
- Infra: Docker Compose, Nginx/Proxy Manager

## Zmienne środowiskowe
Backend (docker-compose lub sekret):
- RESEND_API_KEY – klucz Resend
- TARGET_EMAIL – adres odbiorcy
- OPENAI_API_KEY – klucz OpenAI
- ALLOWED_ORIGIN – lista do CORS (np. `https://akgarten.com,https://www.akgarten.com`)
- OPENAI_MODEL, OPENAI_FALLBACK_MODEL – modele dla chatu
- APP_VERSION – opcjonalna etykieta wersji
- ADMIN_TOKEN – token do panelu admina (Bearer)

Frontend (opcjonalnie w .env):
- VITE_SHOW_ADMIN_LINK=1 – pokaż link „Admin” w stopce (domyślnie ukryty)

## Lokalny development
- Root: `npm install`
- Backend: `cd backend && npm install`
- Backend lokalnie: `RESEND_API_KEY=... TARGET_EMAIL=... OPENAI_API_KEY=... ALLOWED_ORIGIN=http://localhost:5173 node server.mjs`
- Front: `npm run dev` (http://localhost:5173)
- W dev ustaw proxy `/api/*` na `http://localhost:3001` (NPM lub konfiguracja dev-proxy)

## Produkcja (Docker Compose)
1) Sieć współdzielona dla proxy: `docker network create services-network` (jednorazowo)

2) docker-compose.yml (backend) – ważne:
- volumes:
  - `./public/gallery:/app/public/gallery`
  - `./data:/app/data`
- env: ustaw m.in. `ADMIN_TOKEN`

3) Reverse proxy (Nginx Proxy Manager):
- `/` → frontend:80
- `/api/` → backend:3001
- HTTPS + HTTP/2 + HSTS
- Dla uploadów zwiększ limit: `client_max_body_size 20m`, oraz `proxy_read_timeout 60s` na `/api/`

4) Build i uruchom:
- `docker compose up -d --build`

5) Healthchecki
- `GET /health` → `{ status: "ok" }`
- `GET /api/health` → szczegóły (czas, wersja, modele, CORS)

## Galeria – dodawanie/zarządzanie (rekomendowane)
- Wejdź na `/admin` (włącz link w stopce przez `VITE_SHOW_ADMIN_LINK=1` lub wejdź bezpośrednio)
- Wklej token (ADMIN_TOKEN)
- Zakładki:
  - „Dodaj zdjęcia” – drag’n’drop wielu plików; możesz dodać wspólny tytuł/opis (zapis do każdego)
  - „Dodaj parę” – wybierz before/after + meta
  - „Lista” – zobacz wszystkie elementy (miniatura), edytuj tytuł/opis, usuń
- API backendu aktualizuje JSON manifest: `data/gallery.json`. Obrazy lądują w `public/gallery` (oraz thumbs w `public/gallery/thumbs`).

## Galeria – skrypty narzędziowe (manual/zaawansowane)
- Generuj miniatury (max 800px): `npm run thumbs` (scripts/gen-thumbs.mjs)
- Nadaj watermark obecnym zdjęciom i przebuduj thumbs: `npm run watermark` (scripts/watermark-existing.mjs)

Uwaga: obecny front pobiera manifest z `/api/gallery`. Plik `src/data/galleryManifest.ts` jest historyczny i nieużywany przez komponent Galerii.

## Endpointy backend (galeria)
- GET `/api/gallery` – publiczny manifest JSON
- GET `/api/admin/list` – lista (wymaga `Authorization: Bearer ADMIN_TOKEN`)
- POST `/api/admin/upload-single` – `file`, `title?`, `description?`
- POST `/api/admin/upload-pair` – `beforeFile`, `afterFile`, `title?`, `description?`
- PATCH `/api/admin/meta/:id` – `{ title, description }` (puste stringi czyszczą)
- DELETE `/api/admin/item/:id`

## Skrypty
- `npm run dev` – dev server frontendu
- `npm run build` – build frontendu
- `npm run lint` – typecheck + test build
- `npm run thumbs` – generacja miniaturek
- `npm run watermark` – watermark dla istniejących + przebudowa miniaturek

## Jak poprawnie zaktualizować serwer do nowej wersji
Załóżmy, że repo już jest na serwerze, reverse proxy działa.

1) Ustaw/env i flagi (jednorazowo lub przy zmianie):
- `.env` (lub panel sekretów):
  - `RESEND_API_KEY`, `TARGET_EMAIL`, `OPENAI_API_KEY`, `ALLOWED_ORIGIN`
  - `OPENAI_MODEL`, `OPENAI_FALLBACK_MODEL`, `APP_VERSION`
  - `ADMIN_TOKEN` (mocny losowy)
- Frontend (opcjonalnie): `VITE_SHOW_ADMIN_LINK=1`

2) Pobierz nową wersję kodu:
```powershell
git fetch --all
git pull
```

3) (Opcjonalnie) Zainstaluj zależności na hoście do narzędziowych skryptów:
```powershell
npm ci
```

4) Nadaj watermark obecnym zdjęciom i odbuduj miniatury (raz po przejściu na watermarky):
```powershell
npm run watermark
```

5) Zbuduj i przeładuj kontenery (backend ma już wolumeny na `public/gallery` i `data`):
```powershell
docker compose up -d --build
```

6) Zaktualizuj reverse proxy jeśli trzeba:
- routing `/api/` do backend:3001
- `client_max_body_size 20m`, `proxy_read_timeout 60s`

7) Smoke-test:
```powershell
curl.exe http(s)://twojadomena/api/health
curl.exe http(s)://twojadomena/api/gallery
```
- Wejdź na `/admin`, wklej token, wrzuć testowe zdjęcie, sprawdź, czy pojawia się w Galerii na stronie głównej.

## E-mail i Chat
- POST `/api/send-email` – przez Resend
- POST `/api/chat` – OpenAI z retry/degrade

## Bezpieczeństwo i logi
- Helmet, Zod, rate-limit, CORS allowlist, morgan z `x-request-id`
- Auth panelu: Bearer token (`ADMIN_TOKEN`). Dla większej twardości możesz dorzucić dodatkowy Basic Auth na `/admin/*` w proxy.

## Licencja
Proprietary – kontakt w celu ustalenia warunków.
