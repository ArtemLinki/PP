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

### API
- REST API с эндпоинтами для: товаров, категорий, брендов, корзины, заказов, пользователей
- Все цены хранятся в минорных единицах (копейках), форматирование на фронте через `formatPrice()`

---

## AI

| Слой | Технология |
|---|---|
| Провайдер | Google Gemini API (бесплатный tier) |
| SDK | `@google/generative-ai` |
| Интеграция | NestJS AI-сервис на бэкенде |
| Модель | `gemini-2.0-flash` (бесплатная) |

**Сценарий использования:**
- Чат с ИИ-помощником: пользователь задаёт вопросы о комплектующих (выбор, совместимость, характеристики), ИИ отвечает в текстовом формате
- Точка входа: главная страница → `/ai` чат, фиксированный AI-pill на всех страницах

---

## Deployment

| Слой | Технология |
|---|---|
| Контейнеризация | Docker + Docker Compose |
| Frontend | Vercel или Docker-контейнер |
| Backend | Docker-контейнер (NestJS) |
| База данных | PostgreSQL в Docker или managed (Supabase / Railway) |
| Переменные окружения | `.env.local` (frontend), `.env` (backend) |

### Переключение мок/прод
- `NEXT_PUBLIC_USE_MOCKS=true` — приложение работает без бэкенда на встроенных Mock-сервисах
- `NEXT_PUBLIC_USE_MOCKS=false` + `NEXT_PUBLIC_API_BASE_URL=<url>` — реальный API
