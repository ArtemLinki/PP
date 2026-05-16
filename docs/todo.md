# План реализации TechElectro

> Статус обозначений: `[ ]` — не начато, `[~]` — в процессе, `[x]` — готово

---

## Фаза 0 — Подготовка рабочей среды

- [x] **0.1** Создать структуру монорепо: папки `frontend/`, `backend/`, `common/`
- [x] **0.2** Скопировать `design_handoff_techelectro/scaffold/` в `frontend/`
- [x] **0.3** `npm install` в папке `frontend/`
- [x] **0.4** Создать `.env.local` из `.env.local.example`, убедиться что `NEXT_PUBLIC_USE_MOCKS=true`
- [ ] **0.5** `npm run dev` — убедиться что starter поднимается на `localhost:3000`
- [ ] **0.6** Открыть `design_handoff_techelectro/mockups/index.html` — просмотреть экраны
- [x] **0.7** Инициализировать NestJS-проект в папке `backend/` — создан базовый NestJS app (AppModule, PrismaModule, health endpoint)
- [x] **0.8** Создать `docker-compose.yml` в корне — уже существовал (db, minio, backend, frontend)
- [x] **0.9** Настроить `tsconfig.json` в `frontend/` и `backend/` с path alias `@common/*` на `../../common`

---

## Фаза 1 — Common: общие DTO

- [x] **1.1** `common/dto/common.dto.ts` — `ApiResponse<T>`, `Paginated<T>`, `ID`, `ISODateString`
- [x] **1.2** `common/dto/user.dto.ts` — `UserDto`, `AuthCredentialsDto`, `AuthSessionDto`, `UserRole`
- [x] **1.3** `common/dto/product.dto.ts` — `ProductDto`, `ProductListQuery`, `ProductStatus`
- [x] **1.4** `common/dto/category.dto.ts` — `CategoryDto`
- [x] **1.5** `common/dto/brand.dto.ts` — `BrandDto`
- [x] **1.6** `common/dto/cart.dto.ts` — `CartDto`, `CartItemDto`, `AddToCartDto`, `UpdateCartItemDto`
- [x] **1.7** `common/dto/order.dto.ts` — `OrderDto`, `OrderItemDto`, `CreateOrderDto`, `OrderStatus`
- [x] **1.8** `common/dto/ai.dto.ts`:
  ```typescript
  AiChatRequestDto    // { message, conversationId? }
  AiChatResponseDto   // { conversationId, reply, toolResults? }
  AiMessageDto        // { id, role, content, createdAt }
  AiToolResultDto     // { recommendedProducts?: ProductDto[], addedToCart?: CartDto }
  ```
- [x] **1.9** `common/dto/index.ts` — реэкспорт всех DTO
- [x] **1.10** Обновить импорты в `frontend/src/lib/dto/` → заменить на импорты из `common/dto/`

---

## Фаза 2 — Backend: база данных и ядро

### 2.1 Prisma Schema + миграции
- [x] Подключить Prisma к проекту — `prisma/schema.prisma` создан
- [ ] Включить расширение `pg_trgm` в миграции (нечёткий поиск)
- [x] Сущность `User` (id, email, passwordHash, name, phone, role: B2C|B2B|ADMIN, createdAt)
- [x] Сущность `Category` (id, name, slug, parentId, isVisible, order)
- [x] Сущность `Brand` (id, name, slug, country, website, logoUrl)
- [x] Сущность `Product` (id, name, slug, sku, description, priceMinor, oldPriceMinor, stock, status, categoryId, brandId, images: String[], specs: Json, tags: String[], createdAt)
- [ ] Индекс `GIN` на `searchVector` для полнотекстового поиска
- [x] Сущность `Cart` + `CartItem`
- [x] Сущность `Order` + `OrderItem`
- [x] Сущность `AiConversation` (id, userId, createdAt)
- [x] Сущность `AiMessage` (id, conversationId, role, content, createdAt)
- [x] Первая миграция `npx prisma migrate dev --name init`
- [x] Добавить `prisma/seed.ts` — начальные категории, бренды, тестовые товары
- [x] Скрипт `npm run db:migrate` — запуск миграций
- [x] Скрипт `npm run db:seed` — заполнение тестовыми данными
- [x] Скрипт `npm run db:reset` — сброс + seed (только dev)

### 2.2 Аутентификация
- [x] `POST /auth/register` — B2C/B2B, bcrypt хеширование
- [x] `POST /auth/login` — возврат JWT
- [x] `GET /auth/me`
- [ ] `POST /auth/logout`
- [x] `JwtGuard` + `@CurrentUser()` декоратор

### 2.3 CRUD-модули
- [x] `CategoriesModule` — GET /categories (дерево), GET /categories/:id
- [x] `BrandsModule` — GET /brands, GET /brands/:id
- [x] `ProductsModule`:
  - GET /products (с фильтрами: `categoryId`, `brandId`, `priceMin`, `priceMax`, `search`)
  - Поиск по `search` через contains (case-insensitive)
  - GET /products/:id, GET /products/slug/:slug
  - POST/PATCH/DELETE (admin) — в backlog
- [x] `CartModule` — GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id, DELETE /cart
- [x] `OrdersModule` — GET /orders, GET /orders/:id, POST /orders
- [x] `UsersModule` — GET /users/me, PATCH /users/me

### 2.4 Файловое хранилище (MinIO)
- [ ] Установить `@aws-sdk/client-s3`
- [ ] `FilesModule`: подключение к MinIO через S3-client (`endpoint`, `accessKeyId`, `secretAccessKey`)
- [ ] При старте приложения: создать бакеты `products` и `avatars` если не существуют
- [ ] `POST /files/upload` — принимает `multipart/form-data`, загружает в MinIO, возвращает публичный URL
- [ ] `DELETE /files` — удалить файл по URL
- [ ] Настроить бакет `products` как публичный (для прямого доступа из frontend)

### 2.5 AI-модуль (Gemini + Function Calling)
- [ ] Получить бесплатный API ключ на aistudio.google.com, добавить в `.env`
- [ ] Установить `@google/generative-ai`
- [ ] `ai.tools.ts` — определить tools для Gemini:
  ```typescript
  searchProducts(query: string, categoryId?: string, brandId?: string, maxPrice?: number)
  getProductDetails(productId: string)
  addToCart(productId: string, quantity: number)  // только для авторизованных
  ```
- [ ] `ai.executor.ts` — выполнение tool calls: получает `{name, args}`, вызывает реальный сервис, возвращает результат
- [ ] `ai.service.ts`:
  - Загружает историю из `AiConversation` / `AiMessage`
  - Формирует системный промпт (консультант TechElectro, знает каталог)
  - Передаёт в Gemini: history + message + tools
  - Обрабатывает ответ: текст или tool call
  - Если tool call → `ai.executor.ts` → результат → обратно в Gemini → финальный ответ
  - Сохраняет сообщение + возвращает `AiChatResponseDto`
- [ ] `POST /ai/chat` — основной эндпоинт чата
- [ ] `GET /ai/conversations/:id` — история диалога

### 2.6 Admin-эндпоинты
- [ ] `RolesGuard` — только `ADMIN`
- [ ] `GET /admin/dashboard` — KPI + топ товаров + последние заказы
- [ ] `PATCH /products/:id/status`
- [ ] `PATCH /orders/:id/status`

---

## Фаза 3 — Frontend: Layout и общие компоненты

### 3.1 Тема и токены
- [ ] Проверить/настроить `src/theme/mantine-theme.ts` (цвета, шрифты, радиус 0)
- [ ] Подключить Google Fonts через `next/font/google` (Inter, Space Grotesk, JetBrains Mono)

### 3.2 AppShell / Layout
- [ ] `components/layout/Header.tsx` — логотип + nav + user/cart иконки + badge
- [ ] `components/layout/MobileBottomNav.tsx` — 5 пунктов (Главная, Каталог, ИИ, Корзина, Профиль)
- [ ] `components/layout/AppShell.tsx` — адаптивный shell
- [ ] `components/ai/AiAssistantPill.tsx` — fixed pill, скрыт на mobile при bottom-nav

### 3.3 Общие компоненты
- [ ] `components/product/ProductCard.tsx` — brand, фото, название, specs, цена, «+ В корзину»
- [ ] `components/ui/Eyebrow.tsx` — 10px JetBrains Mono uppercase teal
- [ ] `components/ui/TealBadge.tsx`
- [ ] `components/search/DualModeSearchBar.tsx` — инпут + кнопка AI; управляется пропом `mode: 'search' | 'ai'`, при переключении кнопки меняет поведение отправки
- [ ] `components/ai/AiRecommendationsBlock.tsx` — блок «Подобрано для вас»: горизонтальный список карточек-плашек (фото, название, цена, ссылка на товар)
- [ ] `components/ai/AiChatWindow.tsx` — список сообщений + поле ввода; рендерит `AiRecommendationsBlock` под сообщением если есть `toolResults.recommendedProducts`

---

## Фаза 4 — Frontend: Страницы

### 4.1 Главная (`app/page.tsx`)
**Референс:** `mockups/home-desktop.html` + `mockups/home-mobile.html`
- [ ] Hero с eyebrow «AI ENGINEER · ONLINE»
- [ ] H1 56px, sub-paragraph
- [ ] `DualModeSearchBar` в hero:
  - По умолчанию mode=`search` → `router.push('/catalog?q=...')`
  - При активации AI-кнопки mode=`ai` → `router.push('/ai?q=...')`
- [ ] Chips-ряд с примерами (работают в текущем режиме инпута)
- [ ] Секция фич: 3 колонки с разделителями
- [ ] Mobile-версия

### 4.2 Каталог (`app/catalog/page.tsx`)
**Референс:** `mockups/catalog.html`
- [ ] Двухколоночный layout: sidebar 280px + main
- [ ] **Sidebar — только базовые фильтры:**
  - Выбор категории (иерархия, активная в teal)
  - Диапазон цены (range slider)
  - Чипы брендов (мультивыбор)
  - Кнопка «Сбросить всё» в orange
- [ ] Main: search bar (`DualModeSearchBar`), счётчик результатов, sort-pill, view-toggle
- [ ] Product grid `SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}`
- [ ] Пагинация
- [ ] Интеграция: `useQuery(services.products.list({q, categoryId, brandId, priceMin, priceMax}))`
- [ ] Активные фильтры как teal-chips с ✕

### 4.3 AI-чат (`app/ai/page.tsx`)
**Референс:** `mockups/search.html`
- [ ] При открытии: если в query params есть `?q=...` — отправить как первое сообщение автоматически
- [ ] `AiChatWindow` на всю высоту страницы
- [ ] Сообщения пользователя (справа, teal border) и ассистента (слева)
- [ ] Под сообщением ассистента — `AiRecommendationsBlock` если `toolResults.recommendedProducts` не пустой
- [ ] Уведомление (toast) если `toolResults.addedToCart` — «Товар добавлен в корзину»
- [ ] Индикатор загрузки (пульсирующая точка или skeleton)
- [ ] Поле ввода внизу + кнопка отправки
- [ ] Интеграция: `useAiStore.send()` → `POST /ai/chat`

### 4.4 Корзина (`app/cart/page.tsx`)
**Референс:** `mockups/cart.html`
- [ ] Двухколоночный layout: list 1fr + sticky summary 380px
- [ ] CartItem: фото, название + stock-badge, бренд/SKU, qty stepper, удаление, цена × кол-во
- [ ] Summary sticky: строки итога, промокод, «Оформить заказ →», иконки оплаты
- [ ] Интеграция: `useCartStore` + `useQuery(services.cart.getCurrent())`

### 4.5 Login (`app/login/page.tsx`)
**Референс:** `mockups/login.html`
- [ ] Панель 480px: email + password, Submit, OAuth кнопки, ссылка на регистрацию
- [ ] `useAuthStore.login()`

### 4.6 Register (`app/register/page.tsx`)
**Референс:** `mockups/register.html`
- [ ] Панель 540px: ФИО, email, пароль, подтверждение, телефон
- [ ] Выбор типа B2C / B2B
- [ ] Чекбокс согласия
- [ ] `services.auth.register()`

---

## Фаза 5 — Frontend: Административная панель

### 5.1 Admin Shell (`app/admin/layout.tsx`)
- [ ] Admin topbar: лого + «Admin» badge + поиск + аватар
- [ ] Sidebar 240px с группами nav, активный пункт 3px teal-left-border
- [ ] RoleGuard: редирект если не ADMIN

### 5.2 Дашборд (`app/admin/dashboard/page.tsx`)
**Референс:** `mockups/admin-dashboard.html`
- [ ] 4 KPI: Товаров / Заказы / Выручка / AI-запросы
- [ ] SVG line-chart продаж
- [ ] Bar-чарты категорий
- [ ] Alert о заканчивающихся SKU (orange dashed)
- [ ] Последние заказы + топ товаров

### 5.3 Товары (`app/admin/products/page.tsx`)
**Референс:** `mockups/admin-products.html`
- [ ] Таблица: ☐ · Товар · SKU · Категория · Цена · Остаток · Статус · Действия
- [ ] Toolbar: поиск + фильтры + chips статусов
- [ ] Кнопка «+ Добавить товар» → `<ProductModal />`

### 5.4 Модалка товара (`components/admin/ProductModal.tsx`)
**Референс:** `mockups/product-modal.html`
- [ ] Left: название, категория, бренд, SKU, цена, загрузка изображений (через `POST /files/upload`), спецификации (key/value), описание
- [ ] Right aside: статус публикации, остаток, старая цена, теги
- [ ] Футер: автосохранение + Отмена / Черновик / Сохранить
- [ ] Автосохранение через debounce

### 5.5 Категории (`app/admin/categories/page.tsx`)
**Референс:** `mockups/admin-categories.html`
- [ ] Дерево категорий L1/L2, toggle видимости, add-row

### 5.6 Бренды (`app/admin/brands/page.tsx`)
**Референс:** `mockups/admin-brands.html`
- [ ] Grid карточек: лого, название, URL/страна, SKU, выручка

### 5.7 Заказы (`app/admin/orders/page.tsx`)
**Референс:** `mockups/admin-orders.html`
- [ ] 4 stat-карточки + таблица заказов

---

## Фаза 6 — Интеграция Frontend ↔ Backend

- [ ] **6.1** Поднять весь docker-compose (db + minio + backend + frontend)
- [ ] **6.2** Переключить `NEXT_PUBLIC_USE_MOCKS=false`, проверить авторизацию
- [ ] **6.3** Проверить поиск: обычный нечёткий (с опечатками) → результаты в каталоге
- [ ] **6.4** Проверить AI-режим: вопрос → текстовый ответ Gemini
- [ ] **6.5** Проверить function calling: «подбери мне процессор» → `searchProducts` → карточки «Подобрано для вас»
- [ ] **6.6** Проверить `addToCart` из чата → обновление корзины + уведомление
- [ ] **6.7** Проверить загрузку изображений: модалка товара → MinIO → URL сохраняется в БД
- [ ] **6.8** Проверить корзину и оформление заказа
- [ ] **6.9** Проверить admin-панель: CRUD товаров, статусы заказов

---

## Фаза 7 — Качество и деплой

### 7.1 Качество кода
- [ ] `npm run type-check` без ошибок в frontend и backend
- [ ] `npm run lint` без ошибок
- [ ] Pixel-perfect проверка всех экранов по мокапам
- [ ] Тест адаптивности: mobile 402px + desktop 1280px
- [ ] Проверить dual-mode инпут: переключение search ↔ AI

### 7.2 Оптимизация
- [ ] TanStack Query staleTime / cacheTime
- [ ] `next/image` для изображений из MinIO

### 7.3 Деплой
- [ ] Переменные окружения для production
- [ ] CI/CD (GitHub Actions): lint + type-check + build
- [ ] Деплой frontend на Vercel или Docker
- [ ] Деплой backend + MinIO на VPS / Railway
- [ ] Managed PostgreSQL (Supabase / Railway)

---

## Технический долг / Backlog

- [ ] OAuth (Google, GitHub) через Passport.js
- [ ] reCAPTCHA при регистрации
- [ ] Страница профиля (`app/account/page.tsx`)
- [ ] Страница истории заказов (`app/orders/page.tsx`)
- [ ] Email-нотификации об изменении статуса заказа
- [ ] Экспорт CSV заказов и товаров
- [ ] Wishlist (избранное)
- [ ] Аутентификация B2B: реквизиты, договор, НДС
- [ ] Расширение AI tools: `compareProducts`, `checkStock`, `getRecommendedByBudget`
- [ ] i18n (next-intl)

---

## Порядок выполнения (спринты)

| Спринт | Задачи | Результат |
|---|---|---|
| 1 | Фаза 0 + Фаза 1 | Среда поднята (включая MinIO), общие DTO готовы |
| 2 | Фаза 2.1–2.3 | Backend CRUD + миграции + seed |
| 3 | Фаза 2.4–2.5 | MinIO upload + AI function calling |
| 4 | Фаза 3 | Frontend layout + DualModeSearchBar + AiRecommendationsBlock |
| 5 | Фаза 4 | Все публичные страницы |
| 6 | Фаза 5 | Admin-панель |
| 7 | Фаза 6 | Интеграция frontend ↔ backend |
| 8 | Фаза 7 | Качество + деплой |
