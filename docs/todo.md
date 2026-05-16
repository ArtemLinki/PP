# План реализации TechElectro

> Статус обозначений: `[ ]` — не начато, `[~]` — в процессе, `[x]` — готово

---

## Фаза 0 — Подготовка рабочей среды

- [ ] **0.1** Создать структуру монорепо: папки `frontend/`, `backend/`, `common/`
- [ ] **0.2** Скопировать `design_handoff_techelectro/scaffold/` в `frontend/`
- [ ] **0.3** `npm install` в папке `frontend/`
- [ ] **0.4** Создать `.env.local` из `.env.local.example`, убедиться что `NEXT_PUBLIC_USE_MOCKS=true`
- [ ] **0.5** `npm run dev` — убедиться что starter поднимается на `localhost:3000`
- [ ] **0.6** Открыть `design_handoff_techelectro/mockups/index.html` — просмотреть все 15 экранов
- [ ] **0.7** Инициализировать NestJS-проект в папке `backend/` (`nest new backend`)
- [ ] **0.8** Настроить Prisma + подключение к PostgreSQL (локально через Docker Compose)
- [ ] **0.9** Создать `docker-compose.yml` в корне с сервисами `db` (postgres) + `backend` + `frontend`
- [ ] **0.10** Настроить `tsconfig.json` в `frontend/` и `backend/` с path alias на `../../common`

---

## Фаза 1 — Common: общие DTO

- [ ] **1.1** Создать `common/dto/common.dto.ts` — `ApiResponse<T>`, `Paginated<T>`, `PriceDto`, `ID`, `ISODateString`
- [ ] **1.2** Создать `common/dto/user.dto.ts` — `UserDto`, `AuthCredentialsDto`, `AuthSessionDto`, `UserRole`
- [ ] **1.3** Создать `common/dto/product.dto.ts` — `ProductDto`, `ProductListQuery`, `ProductStatus`
- [ ] **1.4** Создать `common/dto/category.dto.ts` — `CategoryDto`
- [ ] **1.5** Создать `common/dto/brand.dto.ts` — `BrandDto`
- [ ] **1.6** Создать `common/dto/cart.dto.ts` — `CartDto`, `CartItemDto`, `AddToCartDto`, `UpdateCartItemDto`
- [ ] **1.7** Создать `common/dto/order.dto.ts` — `OrderDto`, `OrderItemDto`, `CreateOrderDto`, `OrderStatus`
- [ ] **1.8** Создать `common/dto/ai.dto.ts` — `AiMessageDto`, `AiPromptDto`, `AiPromptResponseDto` (только текст, без рекомендаций)
- [ ] **1.9** Создать `common/dto/index.ts` — реэкспорт всех DTO
- [ ] **1.10** Обновить импорты в `frontend/src/lib/dto/` → заменить на импорты из `common/dto/`

---

## Фаза 2 — Backend: база данных и ядро

### 2.1 Prisma Schema
- [ ] Сущность `User` (id, email, passwordHash, name, phone, role: B2C|B2B|ADMIN, createdAt)
- [ ] Сущность `Category` (id, name, slug, parentId, isVisible, order)
- [ ] Сущность `Brand` (id, name, slug, country, website, logoUrl)
- [ ] Сущность `Product` (id, name, slug, sku, description, priceMinor, oldPriceMinor, stock, status, categoryId, brandId, images[], specs JSON, tags[], createdAt)
- [ ] Сущность `Cart` (id, userId, items[])
- [ ] Сущность `CartItem` (id, cartId, productId, quantity)
- [ ] Сущность `Order` (id, userId, status, items[], totalMinor, deliveryType, promoCode, createdAt)
- [ ] Сущность `OrderItem` (id, orderId, productId, quantity, priceMinor)
- [ ] Сущность `AiConversation` (id, userId, createdAt)
- [ ] Сущность `AiMessage` (id, conversationId, role: user|assistant, content, createdAt)
- [ ] Сущность `Project` (id, userId, name, projectSku, status, items[], createdAt, updatedAt)
- [ ] Миграция `npx prisma migrate dev`

### 2.2 Аутентификация (NestJS Auth модуль)
- [ ] `POST /auth/register` — регистрация B2C/B2B, хеширование пароля (bcrypt)
- [ ] `POST /auth/login` — возврат JWT access token
- [ ] `GET /auth/me` — текущий пользователь
- [ ] `POST /auth/logout`
- [ ] JwtGuard + декоратор `@CurrentUser()`
- [ ] OAuth-заглушки Google + GitHub (можно реализовать позже)

### 2.3 CRUD-модули
- [ ] `CategoriesModule` — GET /categories, GET /categories/:id
- [ ] `BrandsModule` — GET /brands, GET /brands/:id, POST/PATCH/DELETE (admin)
- [ ] `ProductsModule` — GET /products (с фильтрами, пагинацией), GET /products/:id, POST/PATCH/DELETE (admin)
- [ ] `CartModule` — GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id, DELETE /cart
- [ ] `OrdersModule` — GET /orders, GET /orders/:id, POST /orders
- [ ] `UsersModule` — GET /users/me, PATCH /users/me
- [ ] `ProjectsModule` — GET /projects, GET /projects/:id, POST /projects, PATCH /projects/:id, DELETE /projects/:id

### 2.4 AI-модуль (Gemini)
- [ ] Получить бесплатный API ключ на [aistudio.google.com](https://aistudio.google.com)
- [ ] Установить `@google/generative-ai`
- [ ] `AiService.chat()` — отправка сообщения в Gemini API с системным промптом
- [ ] Системный промпт: роль «ИИ-консультант магазина TechElectro», отвечает на вопросы о комплектующих
- [ ] `POST /ai/prompt` — принимает `{message, conversationId?}`, возвращает текстовый ответ
- [ ] `GET /ai/conversations/:id` — история диалога
- [ ] Хранение диалогов в `AiConversation` + `AiMessage`

### 2.5 Admin-эндпоинты
- [ ] Защита через `RolesGuard` (только `ADMIN`)
- [ ] `GET /admin/dashboard` — статистика (KPI, топ товаров, последние заказы)
- [ ] `PATCH /products/:id/status` — публикация/архив
- [ ] `PATCH /orders/:id/status` — смена статуса заказа

---

## Фаза 3 — Frontend: Layout и общие компоненты

### 3.1 Тема и токены
- [ ] Проверить/настроить `src/theme/mantine-theme.ts` (цвета, шрифты, радиус 0)
- [ ] Подключить Google Fonts через `next/font/google` (Inter, Space Grotesk, JetBrains Mono)
- [ ] Убедиться что CSS-переменные из `_shared.css` соответствуют Mantine-теме

### 3.2 AppShell / Layout
- [ ] `components/layout/Header.tsx` — логотип + nav (Каталог, Проекты, ИИ-подбор, Сборки) + user/cart иконки + badge счётчика корзины
- [ ] `components/layout/MobileBottomNav.tsx` — 5 пунктов (Главная, Каталог, ИИ, Корзина, Профиль), высота 64 + safe-area
- [ ] `components/layout/AppShell.tsx` — объединяет Header + MobileBottomNav, адаптивно скрывает/показывает
- [ ] `components/ai/AiAssistantPill.tsx` — fixed pill правый нижний угол, скрыт на mobile при видимом bottom-nav
- [ ] Cart-badge: подключить к `useCartStore.selectCartItemsCount`

### 3.3 Общие компоненты
- [ ] `components/product/ProductCard.tsx` — brand label, discount badge, image placeholder, title, specs (mono), цена, кнопка «+ В сборку»
- [ ] `components/ui/Eyebrow.tsx` — 10px JetBrains Mono uppercase teal label
- [ ] `components/ui/TealBadge.tsx` — статус-бейдж в teal-рамке
- [ ] `components/ai/AiChatWindow.tsx` — контейнер для чата: список сообщений + поле ввода

---

## Фаза 4 — Frontend: Публичные страницы

### 4.1 Главная страница (`app/page.tsx`)
**Референс:** `mockups/home-desktop.html` + `mockups/home-mobile.html`
- [ ] Hero с eyebrow «AI ENGINEER · ONLINE» (teal точка)
- [ ] H1 56px Space Grotesk: «Техника, которая собирает сама себя.\nСпросите ИИ.» (вторая строка teal)
- [ ] Sub-paragraph 15px muted
- [ ] `AiPromptCard` — teal border 1.5px, glow, поле ввода + CTA → redirect в `/ai` с вопросом в query params
- [ ] Chips-ряд с примерами запросов
- [ ] Секция фич: 3 колонки с разделителями
- [ ] Mobile: адаптированный hero с уменьшенными padding

### 4.2 Каталог (`app/catalog/page.tsx`)
**Референс:** `mockups/catalog.html`
- [ ] Двухколоночный layout: sidebar 280px + main
- [ ] Sidebar: иерархические категории (активная в teal), фильтры цены (range slider), чипы интерфейсов, чипы брендов, кнопка «Сбросить всё» в orange
- [ ] Main: search bar, хлебные крошки + счётчик, sort-pill, view-toggle (grid/list)
- [ ] Product grid `SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}`
- [ ] Пагинация
- [ ] Интеграция: `useQuery(services.products.list(query))`
- [ ] Активные фильтры как teal-chips с ✕

### 4.3 AI-чат (`app/ai/page.tsx`)
**Референс:** `mockups/search.html`
- [ ] Top-bar с полем ввода + кнопка отправки
- [ ] Список сообщений: сообщения пользователя (справа) и ассистента (слева), визуально разделены
- [ ] Если в query params есть начальный вопрос (с главной страницы) — отправить автоматически
- [ ] Поле ввода нового сообщения внизу + кнопка отправки
- [ ] Индикатор загрузки пока ИИ отвечает
- [ ] Интеграция: `useAiStore.send()` → `POST /ai/prompt`
- [ ] История диалога подгружается по conversationId если пользователь авторизован

### 4.4 Сборки сообщества (`app/community/page.tsx`)
**Референс:** `mockups/community.html`
- [ ] Создать `IBuildsService` + `BuildsMockService` + `BuildsApiService`
- [ ] Добавить `BuildDto` в `common/dto/build.dto.ts`
- [ ] H1 + search bar (max-width 720)
- [ ] Tab-ряд категорий с count
- [ ] Grid 3×N Build-карточек
- [ ] Build-карточка: фото 16:9, level-tag (PRO/MID/EASY), title, description, specs-chips, author (avatar + rating), цена, кнопки

### 4.5 Корзина (`app/cart/page.tsx`)
**Референс:** `mockups/cart.html`
- [ ] H1 + project tag в teal-рамке «ПРОЕКТ · IOT-EDGE-NODE-V2»
- [ ] Двухколоночный layout: list 1fr + sticky summary 380px
- [ ] CartItem: фото, название + stock-badge, бренд/SKU, specs-chips, qty stepper, удаление/избранное, цена × кол-во
- [ ] Summary sticky: строки итога, промокод (input + кнопка), «Оформить заказ →», иконки оплаты, secure note
- [ ] Интеграция: `useCartStore` + `useQuery(services.cart.getCurrent())`
- [ ] «Сохранить как BOM» → создание публичной сборки

### 4.6 Проекты (`app/projects/page.tsx`)
**Референс:** `mockups/projects.html`
- [ ] H1 + статистика (проекты · компоненты · сумма)
- [ ] Toolbar: «+ Создать новый проект» + «Импорт CSV» + view-toggle
- [ ] Project-row: иконка, название + артикул, даты, теги (включая «нет в наличии» в orange), итог, кнопки
- [ ] Левая граница 3px (teal = active, orange = danger)
- [ ] Контекстное меню (⋮): переименовать, в сборку, дублировать, удалить (orange)

### 4.7 Аутентификация

#### Login (`app/login/page.tsx`)
**Референс:** `mockups/login.html`
- [ ] Центрированная панель 480px
- [ ] Форма: email + password (eye-icon, teal border)
- [ ] Submit «Войти →» с glow
- [ ] Divider «ИЛИ» в mono
- [ ] Кнопки OAuth: Google + GitHub
- [ ] Footer со ссылкой на регистрацию
- [ ] Интеграция: `useAuthStore.login()`

#### Register (`app/register/page.tsx`)
**Референс:** `mockups/register.html`
- [ ] Панель 540px
- [ ] Поля: ФИО, email, пароль, подтверждение, телефон (опционально)
- [ ] Выбор типа аккаунта: B2C / B2B (radio grid)
- [ ] Чекбокс согласия + reCAPTCHA mock
- [ ] Submit → `services.auth.register()`

---

## Фаза 5 — Frontend: Административная панель

### 5.1 Admin Shell (`app/admin/layout.tsx`)
**Референс:** все `mockups/admin-*.html`
- [ ] Admin topbar: лого + «Admin» badge + store-picker + глобальный поиск + аватар пользователя
- [ ] Sidebar 240px: сгруппированный nav (Аналитика / Каталог / Продажи / Контент), активный пункт с 3px teal-left-border
- [ ] RoleGuard: редирект если пользователь не ADMIN

### 5.2 Дашборд (`app/admin/dashboard/page.tsx`)
**Референс:** `mockups/admin-dashboard.html`
- [ ] H1 + LIVE badge (teal pill с анимированной точкой) + period toggle (7д/30д/90д) + Экспорт
- [ ] 4 KPI-карточки: Товаров / Заказы (мес) / Выручка / AI-запросы
- [ ] SVG line-chart продаж (area-gradient teal + dashed grey для прошлой недели)
- [ ] Горизонтальные bar-чарты популярных категорий
- [ ] Alert в orange dashed: «3 SKU заканчиваются»
- [ ] Таблица последних заказов
- [ ] Список топ-товаров

### 5.3 Товары (`app/admin/products/page.tsx`)
**Референс:** `mockups/admin-products.html`
- [ ] H1 + кнопки «Импорт CSV» + «+ Добавить товар»
- [ ] Toolbar: поиск + Категория ▾ + Бренд ▾ + Цена ▾
- [ ] Filter chips: Все / Опубликованы / Черновики / Архив / Заканчиваются
- [ ] Таблица с колонками: ☐ · Товар (image+name+brand) · SKU · Категория · Цена · Остаток · Статус · Действия
- [ ] Пагинация
- [ ] Кнопка «+ Добавить товар» → открывает `<ProductModal />`

### 5.4 Модалка товара (`components/admin/ProductModal.tsx`)
**Референс:** `mockups/product-modal.html`
- [ ] Backdrop rgba(8,10,16,0.75) + blur(4), modal 880px с teal border-glow
- [ ] Left (1fr): название, категория + бренд, SKU + цена, слоты изображений (4×2 grid), спецификации (key/value таблица), описание
- [ ] Right (280px aside): статус публикации (radio), остаток, старая цена, теги
- [ ] Футер: «● Автосохранение · HH:MM» + Отмена / Черновик / Сохранить →
- [ ] Автосохранение через debounce + `PATCH /products/:id`

### 5.5 Категории (`app/admin/categories/page.tsx`)
**Референс:** `mockups/admin-categories.html`
- [ ] Layout: tree-panel 1fr + summary-panel 320
- [ ] Add row: input + «+ Добавить категорию»
- [ ] Дерево: L1 (arrow, icon, name, count, toggle-visibility), L2 (indent 28px, «└» prefix)
- [ ] Toggle visibility — switch 28×18, border-radius 9px
- [ ] Summary: 4 стата + 2 кнопки

### 5.6 Бренды (`app/admin/brands/page.tsx`)
**Референс:** `mockups/admin-brands.html`
- [ ] Toolbar: поиск + сортировка
- [ ] Grid 3×N карточек брендов
- [ ] Brand-карточка: лого (64×64 аббревиатура в teal), название, URL/страна, SKU, выручка, stock-badge, действия

### 5.7 Заказы (`app/admin/orders/page.tsx`)
**Референс:** `mockups/admin-orders.html`
- [ ] H1 + Экспорт
- [ ] 4 stat-карточки: Всего / Требуют внимания / Оплачено / Выручка 30д
- [ ] Toolbar + filter chips
- [ ] Таблица: # заказа · Покупатель (avatar+name+email) · Позиций · Сумма · Статус · Дата

---

## Фаза 6 — Интеграция Frontend ↔ Backend

- [ ] **6.1** Поднять backend локально, переключить `NEXT_PUBLIC_USE_MOCKS=false`
- [ ] **6.2** Проверить авторизацию: регистрация → логин → JWT в HttpClient → защищённые запросы
- [ ] **6.3** Проверить каталог: список товаров с фильтрами, пагинация, карточка товара
- [ ] **6.4** Проверить корзину: добавление, изменение количества, удаление, оформление заказа
- [ ] **6.5** Проверить AI-чат: вопрос → ответ Gemini → отображение текста, история сохраняется
- [ ] **6.6** Проверить admin-панель: CRUD товаров, категорий, брендов, статусы заказов
- [ ] **6.7** E2E-сценарий: регистрация → вопрос в чат → поиск в каталоге → в корзину → заказ

---

## Фаза 7 — Качество и деплой

### 7.1 Качество кода
- [ ] `npm run type-check` без ошибок (strict TS) в frontend и backend
- [ ] `npm run lint` без ошибок
- [ ] Проверить все экраны на pixel-perfect соответствие дизайн-мокапам
- [ ] Тест адаптивности: mobile 402px + desktop 1280px
- [ ] Проверить hover-состояния карточек (border → teal)
- [ ] Проверить sticky-элементы: header + summary корзины

### 7.2 Оптимизация
- [ ] Настроить TanStack Query staleTime / cacheTime для минимизации запросов
- [ ] Оптимизировать изображения через `next/image` (когда появятся реальные фото)

### 7.3 Деплой
- [ ] Настроить `docker-compose.yml` (postgres + backend + frontend)
- [ ] Настроить переменные окружения для production
- [ ] Настроить CI/CD (GitHub Actions): lint + type-check + build
- [ ] Деплой frontend на Vercel (или Docker)
- [ ] Деплой backend на Railway / Render / VPS
- [ ] Настроить managed PostgreSQL (Supabase или Railway)

---

## Технический долг / Backlog

- [ ] OAuth-интеграция (Google, GitHub) через Passport.js в NestJS
- [ ] reCAPTCHA при регистрации
- [ ] Страница профиля (`app/account/page.tsx`) — просмотр/редактирование данных
- [ ] Страница истории заказов (`app/orders/page.tsx`)
- [ ] Email-нотификации об изменении статуса заказа
- [ ] Экспорт CSV (заказы, товары)
- [ ] Импорт CSV для товаров
- [ ] Функция «Сохранить корзину как BOM-сборку»
- [ ] Дублирование проекта
- [ ] Функция избранного (wishlist)
- [ ] Аутентификация B2B: загрузка реквизитов, договор, НДС
- [ ] i18n (next-intl) — если потребуется мультиязычность

---

## Порядок выполнения (спринты)

| Спринт | Задачи | Результат |
|---|---|---|
| 1 | Фаза 0 + Фаза 1 | Среда поднята, общие DTO готовы |
| 2 | Фаза 2.1–2.3 | Backend CRUD работает |
| 3 | Фаза 2.4–2.5 + Фаза 3 | AI-чат + общий layout |
| 4 | Фаза 4.1–4.3 | Главная + Каталог + AI-чат |
| 5 | Фаза 4.4–4.7 | Все публичные страницы |
| 6 | Фаза 5 | Полная admin-панель |
| 7 | Фаза 6 | Интеграция frontend ↔ backend |
| 8 | Фаза 7 | Качество + деплой |
