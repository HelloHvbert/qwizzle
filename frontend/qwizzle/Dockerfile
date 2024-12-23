# Etap 1: Budowanie aplikacji
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etap 2: Serwowanie aplikacji za pomocą nginx
FROM nginx:alpine

# Skopiuj pliki konfiguracji nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
