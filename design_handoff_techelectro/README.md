# Handoff: TechElectro

> Магазин электроники с ИИ-инженером, который подбирает компоненты под проект
> (микроконтроллеры, сенсоры, питание, роботика).

## Overview

TechElectro — каталог электронных компонентов с интегрированным ИИ-помощником.
Пользователь описывает проект («собрать робот-пылесос», «умная теплица»), ИИ
подбирает совместимые компоненты. Поддерживается каталог с фильтрами, корзина-как-проект,
сборки сообщества, регистрация двух типов аккаунтов (B2C / B2B) и админка магазина
с дашбордом, управлением товарами/категориями/брендами/заказами.

## About the Design Files

**Файлы в этом пакете — это design references, созданные как HTML-прототипы**
(папка `mockups/`). Они отражают намеренный визуальный язык и поведение, но это не
production-код для прямого копирования.

Задача — **воссоздать эти дизайны в целевой среде**: использовать пред-инициализированный
Next.js + TypeScript scaffold в папке `scaffold/` (или другую среду по согласованию)
и реализовать UI поверх его архитектуры. Папка `scaffold/` уже содержит подготовленный
слой данных (DTO, сервисы, HTTP-клиент, Zustand-сторы) и Mantine v7 как UI-фреймворк —
вам нужно собрать страницы из этого по дизайнам.

## Fidelity

**High-fidelity (hifi).** Все 15 экранов в `mockups/` нарисованы с точными цветами
(hex), типографикой, отступами, состояниями. Используйте их как pixel-perfect референс.
Дизайн-токены из Figma извлечены и приведены в этом README, а также продублированы в
`scaffold/src/theme/mantine-theme.ts` и `mockups/_shared.css`.

## Stack (scaffold)

| Слой | Выбор | Зачем |
|---|---|---|
| Framework | Next.js 14 App Router + TypeScript strict | SSR, файловый роутинг |
| UI | Mantine v7 + @tabler/icons-react | Тёмная тема из коробки, customizable |
| State | Zustand (+ persist middleware) | Лёгкий, без бойлерплейта; persist для корзины и токена |
| Server state | TanStack Query | Кеш, ретраи, инвалидация для GET-запросов |
| HTTP | Axios через класс HttpClient | Единый инстанс, auth-интерцептор, обработка 401 |

Запуск scaffold:
```bash
cd scaffold
cp .env.local.example .env.local
npm install
npm run dev
```

По умолчанию `NEXT_PUBLIC_USE_MOCKS=true` — приложение работает без бэкенда на
встроенных Mock-сервисах. Для боя поменяйте флаг и поднимите `NEXT_PUBLIC_API_BASE_URL`.

---

## Design Tokens

### Colors

```
/* Backgrounds */
--bg:           #121826    /* основной фон */
--bg-deep:      #0f1219    /* шапки, sticky-элементы */
--bg-2:         #0e141f    /* sidebars */
--surface:      #1e2533    /* карточки, инпуты, табы */
--surface-2:    #1a2030    /* вложенные карточки */
--surface-3:    #232a3b    /* hover-состояния */

/* Lines */
--line:         #2a3344    /* основные границы */
--line-soft:    #232a3a    /* мягкие разделители */

/* Text */
--text:         #e8eef5    /* основной */
--text-2:       #cdd3df    /* вторичный */
--muted:        #8b95a8    /* пояснения, labels */
--dim:          #6b7588    /* подписи, плейсхолдеры */

/* Accents */
--accent:       #00d4b5    /* фирменный teal */
--accent-soft:  rgba(0, 212, 181, 0.12)
--accent-border:rgba(0, 212, 181, 0.4)
--orange:       #ff8c42    /* скидки, alerts */
--red:          #ff5c63    /* ошибки, отмена */
```

### Typography

Три семейства:
- **Inter** (400/500/600/700) — основной UI: заголовки, кнопки, описания
- **Space Grotesk** (500/600/700) — крупные заголовки (`h1`, `h2`)
- **JetBrains Mono** (400/500/600/700) — числа, артикулы (SKU), технические спецификации, табы, лейблы

Размеры:
```
h1:  56px / 700 / -0.02em / line-height 1.04   Space Grotesk
h2:  32px / 700 / -0.01em / line-height 1.10   Space Grotesk
h3:  22px / 700 / -0.01em                      Space Grotesk
h4:  16px / 600                                Inter
body 14px / 400 / 1.5                          Inter
sm:  13px / 400                                Inter
xs:  12px / 400                                Inter
mono 10–12px / 500 / 0.12em letter-spacing     JetBrains Mono
eyebrow: 10px / 500 / 0.12em / uppercase       JetBrains Mono (accent color)
```

### Spacing

8-pt grid c доп. шагом 4. Конкретные значения, встречающиеся в макете:
```
4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 80, 120
```

### Border radius

**Дизайн использует прямые углы (0px) повсеместно** — это часть бренда. Исключения:
- `border-radius: 9px` — для toggle-pill в admin-категориях
- `border-radius: 50%` — аватары (32px и больше), точки в badge

### Shadows

```
/* AI-promotion ring */
box-shadow: 0 0 24px rgba(0, 212, 181, 0.20);   /* prompt-card */
box-shadow: 0 0 24px rgba(0, 212, 181, 0.30);   /* AI-pill */
box-shadow: 0 0 28px rgba(0, 212, 181, 0.30);   /* primary CTA */

/* Modal */
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(0, 212, 181, 0.10);
```

### Iconography

Используем `@tabler/icons-react` (1.5px stroke, 24×24 base). Иконки в макете
рисуются inline-SVG со stroke-width=1.5. Декоративный wave-логотип:

```svg
<svg width="22" height="14" viewBox="0 0 22 14">
  <path d="M1 7 Q4 1, 7 7 T13 7 T19 7"
    stroke="#00d4b5" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>
```

---

## Screens / Views

15 экранов, разделены на публичную часть (9) и админку (6). Все desktop = 1280×800 если
не указано иначе. Mobile = 402×640 (iPhone 17 reference).

### Public

#### 01. Home / Desktop · `mockups/home-desktop.html`
**Purpose:** Лендинг. Пользователь видит AI-промпт, описывает проект, попадает в `/ai`.

**Layout:**
- Sticky topbar 56px: лого + nav (Каталог, Проекты, ИИ-подбор, Сборки сообщества) слева,
  user + cart icons справа. Cart-badge с счётчиком в teal.
- Hero: padding 120/80/80, центрировано, max-width 940.
  - Eyebrow `AI ENGINEER · ONLINE` (`tag-online`, teal с точкой).
  - `<h1>` 56px Space Grotesk: «Техника, которая собирает сама себя.\n**Спросите ИИ.**»
    (вторая строка в teal).
  - Sub-paragraph 15px muted, max-width 540.
  - Prompt card: tealный border 1.5px, glow `0 0 36px rgba(accent,0.18)`,
    padding 22, max-width 720. Внутри: AI-маркер 32×32 c border teal + поле ввода + CTA.
  - Chips row с примерами запросов.
- Секция фич: 3×1 grid с padding 32, разделители 1px var(--line).
- AI-pill в правом нижнем углу (`position: fixed`), показывает «отклик ~3с».

#### 02. Home / Mobile · `mockups/home-mobile.html`
**Purpose:** Mobile-first hero. iPhone 17 frame 402×870.
- Header без top-nav (только лого + user/cart).
- Hero 28/20 padding, всё центрировано.
- Bottom tab bar: 5 пунктов (Главная, Каталог, ИИ, Корзина, Профиль), высота 64 + safe-area.
- AI-pill в правом углу над bottom-nav (`bottom: 80px`).

#### 03. Catalog · `mockups/catalog.html`
**Purpose:** Каталог компонентов с фильтрами.

**Layout:** 2-колоночный grid — sidebar 280px + main.
- Sidebar:
  - Категории (список) — иерархия с ▸, активная в teal.
  - Фильтры: range-slider цены, чипы интерфейсов (USB-C, I²C, GPIO, SPI, HDMI, PoE),
    slider мощности, чекбоксы брендов.
  - Reset row: «↻ СБРОСИТЬ ВСЁ» в orange + counter активных.
- Main:
  - Search bar 100% width.
  - Crumbs row: путь + count, справа sort-pill + view-toggle (grid/list).
  - Product grid 3×N, карточки 256px высота.
  - Pager: 1 ▪ 2 ▪ 3 ▪ … ▪ 42 ▪ Далее ›.
  - AI-pill справа внизу.

**ProductCard:**
- Background var(--surface), border var(--line).
- Brand label сверху-справа (teal, mono, 10px, 0.12em letter-spacing).
- Discount badge сверху-слева (orange) если есть.
- Image area 92px, placeholder с diagonal stripes.
- Title 14px/600, specs в JetBrains Mono 11px/dim.
- Цена 18px JetBrains Mono Bold teal, oldprice через line-through.
- CTA «+ В сборку» — solid teal на тёмном тексте.

#### 04. AI Search · `mockups/search.html`
**Purpose:** Поиск с ИИ-рекомендациями (mobile-first).
- Top-bar с inline search + AI-button (36×36 border).
- Активные фильтры как teal-chips.
- Tab-row: Категории / Фильтры (4) / Сортировка.
- Brand-row горизонтальная скроллируемая.
- Product grid 2×N.
- AI-section: «✨ ПОДОБРАНО ДЛЯ ВАС» — dashed border, dim background, 2×1 grid.
- Bottom pager с «● ИИ-помощник» pill.

#### 05. Community · `mockups/community.html`
**Purpose:** Каталог BOM-сборок от инженеров сообщества.
- Header h1 «Сборки сообщества» + sub.
- Search-bar 720 max-width.
- Tab-row категорий (Все, Робототехника, ПК, …) — pill-стиль с count.
- Sort-row.
- Build-card 3×N grid:
  - Image 16:9 + body.
  - Cat-label + level-tag (PRO/MID/EASY) в orange.
  - Title 17px Space Grotesk.
  - Description, specs-chips, stats (просмотры, копий).
  - Author row: avatar + name + rating «★ 4.9».
  - Footer: цена + «Подробнее» + «Скопировать».

#### 06. Cart · `mockups/cart.html`
**Purpose:** Корзина как проект.

**Layout:** 2-колоночный grid — list 1fr + sticky summary 380px.
- Head: H1 «Корзина» (40px) + sub.
- Справа от h1: project tag в teal-рамке «ПРОЕКТ · IOT-EDGE-NODE-V2».
- List head: «Товары в корзине (4)» + acts (Очистить / Сохранить как BOM).
- CartItem: grid 80px (img+idx) + info + 200px price-col.
  - В info: name + stock-badge, meta line (бренд · SKU), specs-chips,
    qty stepper + действия (Удалить / В избранное).
  - Price-col: «X ₽ × N» сверху, итог 20px JetBrains Mono teal.
- Summary sticky:
  - Order number в mono.
  - Rows: Товары / Доставка СДЭК (БЕСПЛАТНО badge) / Скидка / НДС / Итого.
  - Promo grid 1fr + 100px, «Применить» кнопка.
  - «Оформить заказ →» — большой teal CTA.
  - Pay-row: МИР, VISA, MASTERCARD, СБП.
  - Secure note в dashed teal border.

#### 07. Projects · `mockups/projects.html`
**Purpose:** Список черновиков-сборок пользователя.
- Head: H1 + stats справа (4 проекта · 27 компонентов · 82 940 ₽).
- Toolbar: «+ Создать новый проект» (teal CTA с glow) + «⊟ Импорт CSV» + view-toggle.
- Project-row: grid 60 + 1fr + 240 + 200 + 50.
  - Левая граница: 3px teal (active) или orange (danger).
  - Icon 40×40 в teal-рамке.
  - Title row: имя + #PRJ-XXX в mono.
  - Dates row: «Создан: dd.mm · Обновлён: dd.mm».
  - Tags: «● 6 товаров», «Arduino · DIY», «● 2 нет в наличии» (orange).
  - Total справа, actions ниже: «Открыть» + «Оформить» (disabled если нет наличия).
- Контекстное меню (на ⋮): Переименовать, Превратить в сборку, Дублировать, Удалить (orange).

#### 08. Login · `mockups/login.html`
**Purpose:** Вход через email/пароль или OAuth.
- Centered panel 480px wide.
- Form head: 36×36 mark в teal-рамке + h2 «Вход в аккаунт».
- 2 поля: email + password (с eye-icon, border в teal).
- Submit «Войти →» — teal с glow.
- Divider «ИЛИ» (mono).
- 2 social кнопки: Google + GitHub (с G и Octocat иконками).
- Footer: «Нет аккаунта? Зарегистрироваться».
- AI-pill bottom-right.

#### 09. Register · `mockups/register.html`
**Purpose:** Регистрация B2C/B2B.
- Panel 540px wide.
- Form head: иконка user+ + h2 + sub.
- Поля: ФИО → Email → 2-col Password/Confirm → Phone (необязательно).
- Account type: 2×1 grid с radio:
  - Частный покупатель / розничные заказы
  - Юр. лицо / ИП / опт · договор · НДС
- Checkbox согласия + reCAPTCHA mock-row.
- Submit «Зарегистрироваться →».

### Admin

Все админ-страницы используют общий shell:
- Admin topbar: лого + «Admin» badge + store-picker + global search + user-pick.
- Sidebar 240px: групированный nav (Аналитика / Каталог / Продажи / Контент),
  активный пункт с 3px teal-left-border.

#### 10. Dashboard · `mockups/admin-dashboard.html`
**Purpose:** Сводная аналитика магазина.
- Head: H1 «Дашборд» + LIVE badge (teal pill с точкой). Период 7д/30д/90д + Экспорт.
- 4 KPI-карточки в одной строке: Товаров, Заказов (мес), Выручка, ИИ-рекомендации.
- График продаж по дням: SVG line-chart с area-gradient teal + dashed grey для прошлой недели.
- Popular categories: горизонтальные bar-чарты с %.
- Alert (orange dashed): «3 SKU заканчиваются — проверить».
- Last orders table + Top products list.

#### 11. Products · `mockups/admin-products.html`
**Purpose:** Таблица 247 SKU.
- Head: H1 + sub + actions (Импорт CSV, + Добавить товар → открывает modal).
- Toolbar: search + Категория ▾ + Бренд ▾ + Цена ▾.
- Filter chips: Все / Опубликованы / Черновики / Архив / Заканчиваются (orange).
- Table с колонками: ☐ · Товар (image+name+brand) · SKU · Категория · Цена · Остаток ·
  Статус · Действия (✎ ⎘ ✕).
- Pager.

#### 12. Categories · `mockups/admin-categories.html`
**Purpose:** Иерархическое дерево категорий.
- Layout: tree-panel 1fr + summary-panel 320.
- Add row: input + кнопка «+ Добавить категорию».
- Tree:
  - Node level 1: arrow ▼/▶, icon, name (600), count, toggle visibility, hover actions.
  - Node level 2: indent 28px + «└» prefix.
- Summary: 4 stat-блока (Всего / Корневых / Макс. глубина / Скрытых) + 2 кнопки.

#### 13. Brands · `mockups/admin-brands.html`
**Purpose:** Карточки производителей.
- Toolbar: search + sort.
- Grid 3×N карточек:
  - 64×64 logo block (текст-аббревиатура в teal).
  - Title + URL/страна.
  - 2 stats (SKU / Выручка).
  - Footer: stock-badge («94% В НАЛИЧИИ» teal или warn) + actions.

#### 14. Orders · `mockups/admin-orders.html`
**Purpose:** Таблица заказов с фильтрами.
- Head: H1 + Экспорт.
- 4 stat-cards (Всего / Требуют внимания / Оплачено / Выручка 30д).
- Toolbar + Filter chips.
- Table: # заказа · Покупатель (avatar+name+email) · Позиций · Сумма · Статус · Дата.

#### 15. Add Product Modal · `mockups/product-modal.html`
**Purpose:** Модалка создания товара.
- Backdrop: rgba(8,10,16,0.75) + blur(4).
- Modal 880px, centered, teal-border-glow.
- Head: H2 + sub + close.
- Body: 2-col grid (1fr + 280px).
  - Left: название, категория+бренд, SKU+цена, изображения (4×2 grid с + слотами),
    спецификации (мини-таблица key/value), описание (textarea).
  - Right (aside): статус публикации (radio 2 опции), остаток, старая цена, теги,
    AI-подсказка в dashed teal-border (похожие SKU, средняя цена, рекомендация тегов).
- Foot: «● Автосохранение черновика · 14:32» + Отмена / Черновик / Сохранить →.

---

## Interactions & Behavior

- **Все CTA с teal background** — в hover темнеют до `#00b89c`.
- **AI-pill** (правый нижний угол) — `position: fixed`, кликабельная, ведёт в `/ai`.
  Скрыта на мобилке когда виден bottom-nav.
- **Hover на карточках** товаров/проектов — border меняется на teal.
- **Cart-badge** показывает счётчик из `useCartStore.selectCartItemsCount`.
- **Toggle visibility** в категориях — горизонтальный switch 28×18.
- **Контекстное меню** проектов (Frame---7) — открывается по клику на ⋮, показывает
  4 пункта; «Удалить проект» — в orange.
- **Модалка добавления** — открывается из admin-products, имеет автосохранение.
- **Активные фильтры** становятся teal-chips с ✕ для снятия.
- **Sticky** элементы: header (top: 0), summary в корзине (top: 80px).

## State Management

Все сторы уже описаны в `scaffold/src/lib/store/`:

- `useCartStore` (Zustand + persist) — корзина: items, totals, refresh / add / update / remove / clear.
- `useAuthStore` (Zustand + persist token) — login / logout / hydrate. Связан с
  HttpClient через `setAuthTokenProvider` и `setOnUnauthorized`.
- `useUiStore` — флаги UI: открытость моб-навигации, AI-панели, тема.
- `useAiStore` — диалог с ИИ: messages, conversationId, send().

## API & Services

Все сервисы реализованы по интерфейсу (`scaffold/src/lib/services/types.ts`):
- `IProductsService`, `ICategoriesService`, `ICartService`, `IOrdersService`,
  `IAiService`, `IAuthService`.

Каждый имеет 2 реализации:
- `*ApiService` — реальные HTTP-запросы через `HttpClient`.
- `*MockService` — локальные данные с искусственной задержкой.

Переключение — `NEXT_PUBLIC_USE_MOCKS=true/false` в `.env.local`.

DTO для всех сущностей в `scaffold/src/lib/dto/`:
- `common.dto.ts` — `ApiResponse<T>`, `Paginated<T>`, `PriceDto`, `ApiErrorDto`, `ID`.
- `product.dto.ts`, `category.dto.ts`, `cart.dto.ts`, `order.dto.ts`,
  `ai.dto.ts`, `user.dto.ts`.

## Responsive

Mobile-first c брейкпоинтами Mantine:
- `xs: 30em`, `sm: 48em` (768px), `md: 64em`, `lg: 75em`, `xl: 90em`.

Правила:
- `<sm`: нижний таб-бар, no top-nav, hero/контент во всю ширину.
- `≥sm`: top-nav в шапке, плавающий AI-pill в правом нижнем углу.
- Каталог: `SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}`.

## Assets

Никаких реальных растровых изображений в макете нет — все заменено на placeholder'ы
с диагональной штриховкой + label (SKU/название). При интеграции подключите CDN
с фотографиями товаров (`ProductImageDto.url` уже в DTO).

Иконки — все из `@tabler/icons-react` или inline-SVG (см. wave-логотип выше).

Шрифты — Google Fonts (Inter, Space Grotesk, JetBrains Mono). В Next.js используйте
`next/font/google` для оптимизации.

## Files

```
design_handoff_techelectro/
├── README.md                         # этот файл
├── overview.html                     # обзорная страница с описанием стека и структуры
├── mockups/                          # ←  ДИЗАЙН-РЕФЕРЕНСЫ (15 экранов)
│   ├── index.html                    # галерея превью всех экранов
│   ├── _shared.css                   # дизайн-токены (use as truth)
│   ├── _admin.css                    # admin-shell стили
│   ├── home-desktop.html             # 01
│   ├── home-mobile.html              # 02
│   ├── catalog.html                  # 03
│   ├── search.html                   # 04 (mobile)
│   ├── community.html                # 05
│   ├── cart.html                     # 06
│   ├── projects.html                 # 07
│   ├── login.html                    # 08
│   ├── register.html                 # 09
│   ├── admin-dashboard.html          # 10
│   ├── admin-products.html           # 11
│   ├── admin-categories.html         # 12
│   ├── admin-brands.html             # 13
│   ├── admin-orders.html             # 14
│   └── product-modal.html            # 15
└── scaffold/                         # ←  ГОТОВЫЙ NEXT.JS + TS STARTER
    ├── package.json
    ├── tsconfig.json (strict, paths: @/, @/dto/, @/services/, @/store/)
    ├── next.config.mjs
    ├── postcss.config.mjs
    ├── .env.local.example
    ├── README.md                     # детали запуска и слоя данных
    └── src/
        ├── app/
        │   ├── layout.tsx            # html + Providers + AppShell
        │   ├── providers.tsx         # Mantine + RQ + ServicesProvider
        │   ├── globals.css
        │   ├── page.tsx              # / — Home (нужно перенести из mockups/home-desktop.html)
        │   ├── catalog/page.tsx
        │   ├── ai/page.tsx
        │   ├── cart/page.tsx
        │   ├── orders/page.tsx
        │   └── account/page.tsx
        ├── components/
        │   ├── layout/               # AppShell · Header · MobileBottomNav
        │   ├── product/              # ProductCard
        │   └── ai/                   # AiAssistantPill · AiPromptCard
        ├── theme/mantine-theme.ts    # tealthemed Mantine theme
        └── lib/
            ├── api/                  # config · http-client · endpoints
            ├── dto/                  # все интерфейсы сущностей
            ├── services/             # 6 сервисов × 2 реализации (Api / Mock)
            ├── store/                # 4 Zustand-стора
            ├── mocks/                # данные для мок-сервисов
            └── format.ts             # formatPrice()
```

## Implementation order

Рекомендуемая последовательность:

1. Открыть `mockups/index.html` — посмотреть все экраны разом.
2. `cd scaffold && npm install && npm run dev` — проверить, что starter поднимается.
3. **Главная** — перенести из `mockups/home-desktop.html` в `scaffold/src/app/page.tsx`,
   используя Mantine-компоненты. Hero card уже частично есть в `AiPromptCard.tsx`.
4. **Каталог** — `catalog.html` → `app/catalog/page.tsx`. Sidebar c фильтрами,
   product-grid через `useQuery` к `services.products.list()`.
5. **Корзина** — `cart.html` → `app/cart/page.tsx`. Использовать `useCartStore`.
6. **Проекты** — `projects.html` → новый `app/projects/page.tsx`. Нужен
   `IProjectsService` (создать по аналогии).
7. **Сборки сообщества** — `community.html` → `app/community/page.tsx`. Нужен
   `IBuildsService`.
8. **Auth-страницы** — `login.html` + `register.html` → `app/login/page.tsx`,
   `app/register/page.tsx`. Использовать `useAuthStore.login()`.
9. **Admin shell** — собрать `app/admin/layout.tsx` с sidebar + topbar.
10. **Admin-страницы** — `admin-dashboard.html`, `admin-products.html`,
    `admin-categories.html`, `admin-brands.html`, `admin-orders.html`. Все используют
    тот же shell.
11. **Modal** — `product-modal.html` → `<Modal>` Mantine, открывается из admin-products.

## Notes для разработчика

- **DTO — источник правды по форме данных.** Если макет требует поле,
  отсутствующее в DTO — добавить в `lib/dto/`, не хардкодить в компоненте.
- **Mock-сервисы — полноценная имитация бэкенда.** Перед интеграцией с реальным
  API проверьте, что вся логика UI работает на моках.
- **Авторизация** — после `login()` HttpClient автоматически шлёт `Authorization: Bearer`
  на каждый запрос; на `401` сессия сбрасывается.
- **Дизайн использует прямые углы повсеместно** — не добавляйте `border-radius` по привычке.
- **Все цены хранятся в минорных единицах (копейках),** форматирование через
  `formatPrice()`. В UI отображаем `1 890 ₽`, в БД лежит `189000`.
- **i18n** — пока всё на русском. Если потребуется, обернуть тексты в `next-intl`
  или аналог.

---

**Контакт по дизайну:** оригинальный Figma + 15 HTML-моков. Все цвета/типографика/spacing
извлечены здесь. Если что-то непонятно — `mockups/<screen>.html` всегда right.
