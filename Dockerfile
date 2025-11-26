# Etap 1: Budowanie aplikacji
FROM node:20 AS build

WORKDIR /app

# Build-time config dla Vite (link Admin w stopce)
ARG VITE_SHOW_ADMIN_LINK
ENV VITE_SHOW_ADMIN_LINK=${VITE_SHOW_ADMIN_LINK}

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę kodu aplikacji
COPY . .

# Budujemy aplikację
RUN npm run build

# Etap 2: Serwowanie aplikacji przez Nginx
FROM nginx:alpine

# Kopiujemy zbudowane pliki z etapu 'build' do katalogu serwowanego przez Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiujemy konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Opcjonalnie: Ustawienie użytkownika, jeśli wymagane
# USER nginx

# Expose port 80
EXPOSE 80

# Uruchamiamy Nginx
CMD ["nginx", "-g", "daemon off;"]
