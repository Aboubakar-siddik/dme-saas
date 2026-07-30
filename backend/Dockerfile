# Étape 1 : Build
FROM node:24-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Builder l'application NestJS
RUN npm run build

# Étape 2 : Production
FROM node:24-alpine
WORKDIR /app

# Copier les dépendances de production et le build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/.env ./

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main.js"]