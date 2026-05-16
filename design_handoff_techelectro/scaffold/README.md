# TechElectro

Магазин электроники с ИИ-инженером для подбора компонентов под проект (микроконтроллеры, сенсоры, питание, роботика).

## Стек

| Слой           | Выбор                                    | Зачем                                                   |
| -------------- | ---------------------------------------- | ------------------------------------------------------- |
| Фреймворк      | **Next.js 14 (App Router) + TypeScript** | SSR, файловый роутинг, готовая инфра                    |
| UI             | **Mantine v7** + **@tabler/icons-react** | Тёмная тема из коробки, насыщенный набор компонентов    |
| State manager  | **Zustand** (+ `persist` middleware)     | Лёгкий, без бойлерплейта, persist для корзины и токена  |
| Server state   | **TanStack Query**                       | Кеш, ретраи, инвалидация для GET-запросов               |
| HTTP клиент    | **Axios** (обёртка `HttpClient`)         | Один инстанс, auth-интерцептор, обработка 401, типизация |

## Запуск

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

По умолчанию `NEXT_PUBLIC_USE_MOCKS=true` — приложение работает без сервера на mock-сервисах.

## Архитектура слоя данных

```
src/lib/
  api/
    config.ts          — env-конфиг, флаг useMocks, ключ токена
    http-client.ts     — класс HttpClient (axios + интерцепторы + типизированный unwrap)
    endpoints.ts       — реестр URL-эндпоинтов
  dto/                 — TypeScript-интерфейсы сущностей
    common.dto.ts      — ApiResponse<T>, Paginated<T>, PriceDto, ApiErrorDto, ID
    product.dto.ts     — ProductDto, ProductListQuery, SpecDto, ProductImageDto, BrandDto, CategoryDto
    cart.dto.ts        — CartDto, CartItemDto, AddToCartDto, UpdateCartItemDto
    order.dto.ts       — OrderDto, OrderStatus, ShippingAddressDto, CreateOrderDto
    ai.dto.ts          — AiMessageDto, AiPromptDto, AiRecommendationDto
    user.dto.ts        — UserDto, AuthCredentialsDto, AuthSessionDto
  services/
    types.ts           — интерфейсы IProductsService, ICartService, IAiService и т.д.
    index.ts           — фабрика createServices(): возвращает либо Mock, либо Api контейнер
    ServicesProvider.tsx — React-контекст для DI
    products/
      ProductsApiService.ts   — реализация через HttpClient
      ProductsMockService.ts  — реализация на локальных данных
    cart/, orders/, ai/, auth/, categories/ — то же по такому же шаблону
    _utils.ts          — delay(), nextId() для моков
  mocks/               — статические данные для Mock-сервисов
  store/
    useCartStore.ts    — Zustand, persist
    useAuthStore.ts    — Zustand, persist токена + связь с HttpClient
    useUiStore.ts      — UI-флаги (дровер, тема, AI-панель)
    useAiStore.ts      — история диалога с ИИ-инженером
  format.ts            — formatPrice() для PriceDto
```

### Переключение mock ⇄ real

Один источник правды — `NEXT_PUBLIC_USE_MOCKS` в `.env.local`. Никаких `if (mock)` в UI-коде: UI и хуки работают только с интерфейсом из `services/types.ts`. Фабрика `createServices()` отдаёт нужную реализацию.

В тестах можно подменить любой сервис:

```ts
import { createServices } from "@/lib/services";
import { ServicesProvider } from "@/lib/services/ServicesProvider";

const fakeProducts = { list: async () => ({ items: [], page: 1, pageSize: 0, total: 0, hasMore: false }) };
const services = createServices({ products: fakeProducts as any });

render(<ServicesProvider services={services}>...</ServicesProvider>);
```

### Auth-flow

1. `useAuthStore.login()` → `services.auth.login()` → возвращает `AuthSessionDto`.
2. Стор сохраняет `token` через `persist` (localStorage).
3. `HttpClient` берёт токен через провайдер `() => useAuthStore.getState().token` и кладёт в `Authorization`.
4. На 401 `HttpClient` вызывает `onUnauthorized`, который сбрасывает сессию в сторе.

## Responsive

Mobile-first. На `<sm` (`< 48em`) — нижний таб-бар (`MobileBottomNav`) и спрятанная навигация в шапке. На `≥ sm` — расширенный header c полной навигацией и плавающий «pill» ИИ-ассистента в правом нижнем углу. Сетка каталога: `1 / 2 / 3 / 4` колонки по брейкпоинтам.

## Страницы

- `/` — главный экран с hero-промптом ИИ (по дизайну из Figma).
- `/catalog` — карточки товаров.
- `/ai` — расширенный диалог с ИИ-инженером, ответы с рекомендациями.
- `/cart` — корзина, изменение количества, оформление заказа.
- `/orders` — список заказов.
- `/account` — вход / профиль.

## Следующие шаги

- Подключить реальный backend (`NEXT_PUBLIC_USE_MOCKS=false`).
- Добавить страницу одного товара `/product/[slug]` (DTO и эндпоинт уже готовы).
- Поиск + фильтры на `/catalog` (`ProductListQuery` готов).
- Чекаут с адресной формой (`ShippingAddressDto` готов).
- Админка для `role: "admin"` (фрейм 11 в Figma).
