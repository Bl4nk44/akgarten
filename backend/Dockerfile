# Używamy oficjalnego obrazu Node.js w wersji 20-alpine
FROM node:20-alpine

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki package.json i package-lock.json (jeśli istnieje)
COPY package.json ./
COPY package-lock.json* ./

# Instalujemy zależności produkcyjne
RUN npm install --omit=dev

# Kopiujemy kod aplikacji
COPY . .

# Ustawiamy zmienne środowiskowe
ENV NODE_ENV=production
ENV PORT=3001

# Odsłaniamy port, na którym działa serwer
EXPOSE 3001

# Uruchamiamy serwer
CMD ["node", "server.mjs"]
