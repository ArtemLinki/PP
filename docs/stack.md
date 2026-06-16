# Стек проекта

## Общее

- Язык: TypeScript (strict mode)
- Монорепо: `frontend/` + `backend/` + `common/` в одном репозитории

---

## Структура монорепо

```
ecommerce/
├── common/          # Общие TypeScript-интерфейсы (DTO), используются и фронтом, и бэком
├── frontend/        # Next.js приложение
└── backend/         # NestJS приложение
```

---

## Common

- Чистые TypeScript-интерфейсы (без декораторов, без зависимостей от фреймворков)
- Импортируются в frontend напрямую
- Импортируются в backend как базовые типы; NestJS-специфичные декораторы (`@IsString()` и т.д.) добавляются через extension/implementation поверх общих интерфейсов

---

## Frontend

| Слой | Технология | Зачем |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, файловый роутинг, оптимизация шрифтов |
| UI-библиотека | Mantine v7 + @tabler/icons-react | Тёмная тема из коробки, кастомизируемые компоненты |
| Управление состоянием | Zustand (+ persist middleware) | Лёгкий стейт без бойлерплейта; persist для корзины и токена |
| Server state / кэш | TanStack Query (React Query v5) | Кэш, ретраи, инвалидация для GET-запросов |
| HTTP-клиент | Axios через класс HttpClient | Единый инстанс, auth-интерцептор, обработка 401 |

### Шрифты (Google Fonts через next/font/google)
- **Inter** (400/500/600/700) — основной UI
- **Space Grotesk** (500/600/700) — крупные заголовки
- **JetBrains Mono** (400/500/600/700) — числа, SKU, технические спецификации

### Дизайн-токены
- Цветовая схема: тёмный фон `#121826` + фирменный teal-акцент `#00d4b5`
- Border radius: 0px (прямые углы — часть бренда)
- Spacing: 8pt grid

---

## Backend

| Слой | Технология |
|---|---|
| Framework | NestJS |
| База данных | PostgreSQL |
| ORM | Prisma |
| Аутентификация | JWT (Bearer токен) |
| Полнотекстовый поиск | PostgreSQL `tsvector` + `pg_trgm` (нечёткий поиск) |
| API-документация | Swagger / OpenAPI 3.0 (`@nestjs/swagger`) |

### API
- REST API с эндпоинтами для: товаров, категорий, брендов, корзины, заказов, пользователей
- Swagger UI доступен на `http://localhost:3001/api/docs` в режиме разработки
- Все цены хранятся в минорных единицах (копейках), форматирование на фронте через `formatPrice()`
- Нечёткий поиск по товарам через `pg_trgm` — ищет по неточным совпадениям названий и описаний

---

## AI

| Слой | Технология |
|---|---|
| Провайдер | Google Gemini API (бесплатный tier) |
| SDK | `@google/generative-ai` |
| Интеграция | NestJS AI-сервис на бэкенде |
| Модель | `gemini-2.0-flash` |
| Паттерн | Function Calling (Gemini Tool Use) |

### Режимы работы главного инпута
- **Обычный поиск** (по умолчанию): нечёткий полнотекстовый поиск по каталогу, переходит на `/catalog?q=...`
- **AI-режим** (кнопка AI нажата): запрос уходит в чат-интерфейс, ИИ отвечает текстом и/или выполняет действия

### Function Calling (Tool Use)
Gemini может вызывать серверные функции из зафиксированного набора инструментов. Бэкенд выступает оркестратором:

| Tool | Что делает |
|---|---|
| `searchProducts(query, filters?)` | Поиск товаров по запросу, возвращает список `ProductDto[]` |
| `getProductDetails(id)` | Подробная информация о конкретном товаре |
| `addToCart(productId, quantity)` | Добавить товар в корзину пользователя |

**Поток:** Frontend → `POST /ai/chat` → NestJS собирает историю + доступные tools → Gemini API →
если Gemini вызвал tool → NestJS выполняет его → результат возвращается Gemini → финальный ответ →
Frontend получает `{text, toolResults: {products?: ProductDto[]}}`.

---

## Хранилище файлов

| Слой | Технология |
|---|---|
| Сервер | MinIO (S3-совместимый, self-hosted) |
| SDK | `@aws-sdk/client-s3` (S3-compatible) |
| Интеграция | NestJS `FilesModule` — upload, presigned URL, delete |
| Бакеты | `products` (изображения товаров), `avatars` (фото пользователей) |

- Загрузка через backend: клиент → `POST /files/upload` → NestJS → MinIO → возвращает публичный URL
- В БД хранится только URL; реальный файл — в MinIO
- В Docker Compose MinIO поднимается как отдельный сервис

---

## Deployment

| Слой | Технология |
|---|---|
| Контейнеризация | Docker + Docker Compose |
| Frontend | Vercel или Docker-контейнер |
| Backend | Docker-контейнер (NestJS) |
| База данных | PostgreSQL в Docker или managed (Supabase / Railway) |
| Файловое хранилище | MinIO в Docker |
| Переменные окружения | `.env.local` (frontend), `.env` (backend) |

### Переключение мок/прод
- `NEXT_PUBLIC_USE_MOCKS=true` — приложение работает без бэкенда на встроенных Mock-сервисах
- `NEXT_PUBLIC_USE_MOCKS=false` + `NEXT_PUBLIC_API_BASE_URL=<url>` — реальный API
