# Étape 1 : Build
FROM node:24-alpine AS build
WORKDIR /app

# Copier les dépendances
COPY package*.json ./
RUN npm ci

# Copier le code source et builder
COPY . .
RUN npm run build

# Étape 2 : Production avec Nginx
FROM nginx:alpine

# Copier le build React dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]