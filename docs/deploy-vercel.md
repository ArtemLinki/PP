# Инструкция по развёртыванию TechElectro

Vercel предназначен только для фронтенда (Next.js). Бэкенд, база данных и хранилище файлов разворачиваются отдельно — рекомендуется Railway как наиболее простой вариант.

---

## Шаг 1 — База данных PostgreSQL (Railway)

1. Зарегистрироваться на [railway.app](https://railway.app)
2. Создать новый проект → **Add Service → Database → PostgreSQL**
3. После создания открыть сервис → вкладка **Variables** → скопировать значение `DATABASE_URL`  
   Выглядит примерно так:
   ```
   postgresql://postgres:пароль@хост:5432/railway
   ```

---

## Шаг 2 — Хранилище файлов (Cloudflare R2 вместо MinIO)

MinIO работает только локально. В продакшене используется Cloudflare R2 (или AWS S3).

1. Зарегистрироваться на [cloudflare.com](https://cloudflare.com)
2. Перейти в раздел **R2 → Create Bucket**, назвать `techelectro-products`
3. В настройках бакета включить **Public Access**
4. Перейти в **R2 → Manage R2 API tokens → Create Token**, выбрать права **Edit**
5. Сохранить `Access Key ID` и `Secret Access Key`
6. Endpoint будет вида: `https://<account_id>.r2.cloudflarestorage.com`

> Если не нужна замена MinIO прямо сейчас — можно оставить MinIO на отдельном VPS и указать его публичный IP.

---

## Шаг 3 — Бэкенд (Railway)

1. В том же проекте Railway → **Add Service → GitHub Repo**
2. Выбрать репозиторий проекта
3. Railway определит Dockerfile — указать путь: `backend/Dockerfile`
4. Открыть сервис → вкладка **Variables**, добавить переменные окружения:

| Переменная | Значение |
|---|---|
| `DATABASE_URL` | строка подключения из Шага 1 |
| `JWT_SECRET` | любая длинная случайная строка |
| `JWT_EXPIRES_IN` | `7d` |
| `AI_API_KEY` | ключ Groq API |
| `MINIO_ENDPOINT` | хост R2 или MinIO (без `https://`) |
| `MINIO_PORT` | `443` (R2) или `9000` (MinIO) |
| `MINIO_USE_SSL` | `true` (R2) или `false` (MinIO) |
| `MINIO_ACCESS_KEY` | Access Key ID из Шага 2 |
| `MINIO_SECRET_KEY` | Secret Access Key из Шага 2 |
| `MINIO_PUBLIC_URL` | публичный URL бакета (напр. `https://pub-xxx.r2.dev`) |

5. Нажать **Deploy** — Railway соберёт Docker-образ и запустит бэкенд
6. После запуска открыть **Settings → Networking → Generate Domain** — Railway выдаст публичный URL бэкенда вида `https://xxx.up.railway.app`

---

## Шаг 4 — Подготовка фронтенда

Перед деплоем на Vercel нужно убрать настройку `output: 'standalone'` из конфига Next.js — она нужна только для Docker и мешает Vercel.

Открыть файл `frontend/next.config.mjs` и убрать строку `output: 'standalone'`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**', pathname: '/**' },
    ],
  },
};

export default nextConfig;
```

Закоммитить изменение:
```bash
git add frontend/next.config.mjs
git commit -m "chore: remove standalone output for Vercel deployment"
git push
```

---

## Шаг 5 — Фронтенд (Vercel)

1. Зарегистрироваться на [vercel.com](https://vercel.com)
2. Нажать **Add New → Project** → выбрать репозиторий
3. В настройках проекта указать:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (определится автоматически)
   - **Build Command:** `cd .. && npm run build` — нет, оставить стандартный `next build`
   
   > Поскольку фронтенд использует типы из папки `common/` в корне репозитория, нужно настроить Build Command:
   - **Build Command:** `cd .. && cp -r common frontend_build_common || true && cd frontend && npm run build`
   
   Проще: в поле **Root Directory** оставить `frontend`, а в **Build Command** написать:
   ```
   cp -r ../common ./common_temp || true && npm run build
   ```
   
   > Если возникают ошибки с путями — альтернативно установить Root Directory как `.` (корень) и Build Command `cd frontend && npm run build`, Output Directory `frontend/.next`

4. В разделе **Environment Variables** добавить:

| Переменная | Значение |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL бэкенда из Шага 3 + `/api`, напр. `https://xxx.up.railway.app/api` |
| `NEXT_PUBLIC_USE_MOCKS` | `false` |

5. Нажать **Deploy**

---

## Шаг 6 — Проверка

После успешного деплоя:

1. Открыть выданный Vercel URL (вида `https://techelectro.vercel.app`)
2. Убедиться что страницы загружаются
3. Попробовать зарегистрироваться и войти
4. Проверить что каталог товаров отображается (данные приходят с бэкенда Railway)
5. Проверить загрузку изображений в админ-панели

---

## Итоговая схема

```
Пользователь
    │
    ▼
Vercel (фронтенд Next.js)
    │
    ├──► Railway (бэкенд NestJS :3001)
    │         │
    │         ├──► Railway PostgreSQL (база данных)
    │         └──► Cloudflare R2 / MinIO (изображения)
    │
    └──► Cloudflare R2 (изображения напрямую из браузера)
```

---

## Часто возникающие проблемы

**Ошибка CORS на бэкенде** — в `backend/src/main.ts` добавить Vercel-домен в список разрешённых origins:
```ts
app.enableCors({
  origin: ['https://techelectro.vercel.app', 'http://localhost:3000'],
  credentials: true,
});
```

**Ошибка сборки — не найден модуль из `common/`** — убедиться что `tsconfig.json` фронтенда правильно указывает пути. Railway и Vercel строят из разных контекстов, поэтому папка `common` должна быть скопирована или симлинкована до сборки.

**Переменные окружения не подхватываются** — переменные с префиксом `NEXT_PUBLIC_` встраиваются в код **во время сборки**, а не в рантайме. После изменения нужно пересобрать проект (Vercel → Deployments → Redeploy).
