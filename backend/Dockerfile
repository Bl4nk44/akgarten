# Etap 1: Budowanie
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiujemy tylko te pliki package.json, które są potrzebne
COPY package.json package-lock.json* ./

# Instalujemy tylko zależności produkcyjne
RUN npm install --omit=dev

# Kopiujemy plik serwera
COPY backend/server.mjs ./backend/

# Etap 2: Produkcja
FROM node:20-alpine

WORKDIR /app

# Kopiujemy zależności i kod z etapu budowania
COPY --from=builder /app .

# Ustawiamy zmienne środowiskowe, jeśli nie są podane z zewnątrz
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Uruchamiamy serwer
CMD ["node", "backend/server.mjs"]
