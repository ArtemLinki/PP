FROM node:20-alpine AS builder

# ВАЖНО: в next.config.mjs должно быть output: 'standalone'
# Без этого сборка standalone не создаётся и CMD ["node", "server.js"] не сработает

WORKDIR /app

# Копируем общие DTO
COPY common ./common

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# Build-time env (публичные переменные должны быть известны при сборке)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_USE_MOCKS=false
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_USE_MOCKS=$NEXT_PUBLIC_USE_MOCKS

RUN npm run build

# ---

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

# Копируем только нужное для запуска Next.js standalone
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
