/**
 * Реестр URL-эндпоинтов. Хранится в одном месте, чтобы случайно не разбежались
 * по разным сервисам и было удобно подменить префикс/версию.
 */
export const endpoints = {
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/by-slug/${slug}`,
  },
  categories: {
    list: "/categories",
    byId: (id: string) => `/categories/${id}`,
  },
  cart: {
    current: "/cart",
    items: "/cart/items",
    item: (itemId: string) => `/cart/items/${itemId}`,
    clear: "/cart/clear",
  },
  orders: {
    list: "/orders",
    byId: (id: string) => `/orders/${id}`,
    create: "/orders",
  },
  ai: {
    prompt: "/ai/prompt",
    conversation: (id: string) => `/ai/conversations/${id}`,
  },
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
} as const;
