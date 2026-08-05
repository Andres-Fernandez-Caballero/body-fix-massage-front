# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias primero para aprovechar la cache de capas de Docker
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables públicas: Expo las hornea en el bundle JS en build time, no en runtime.
# Railway inyecta las variables del servicio como build args automáticamente
# cuando coinciden con un ARG declarado acá.
ARG EXPO_PUBLIC_API_URL
ARG EXPO_PUBLIC_VAPID_PUBLIC_KEY
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_VAPID_PUBLIC_KEY=$EXPO_PUBLIC_VAPID_PUBLIC_KEY

RUN npx expo export --platform web --output-dir dist

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# Railway asigna PORT en runtime; "-s" habilita el fallback de SPA para las rutas
# de expo-router (necesario tanto en output "single" como en "static").
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
