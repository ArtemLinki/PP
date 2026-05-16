/**
 * Конфигурация API. Значения берутся из env, есть дефолты для локальной разработки.
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
  /** Если true — приложение работает на моках без обращения к серверу. */
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true") === "true",
  /** Таймаут на обычный запрос. */
  timeoutMs: 15_000,
  /** Таймаут для AI-запросов (модель может думать ~30с). */
  aiTimeoutMs: 60_000,
  /** Имя ключа в localStorage с access-токеном. */
  authTokenKey: "techelectro.auth.token",
} as const;
