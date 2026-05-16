FROM node:20-alpine AS builder

WORKDIR /app

# Prisma schema engine requires OpenSSL on Alpine
RUN apk add --no-cache openssl

# Копируем общие DTO
COPY common ./common

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ .

# Генерируем Prisma client
RUN npx prisma generate

RUN npm run build

# ---

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init openssl

# Копируем общие DTO
COPY --from=builder /app/common ./common

WORKDIR /app/backend

COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY backend/package*.json ./

ENV NODE_ENV=production

EXPOSE 3001

# dumb-init корректно пробрасывает сигналы в Node
ENTRYPOINT ["dumb-init", "--"]

# Запускаем миграции и затем сервер
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
