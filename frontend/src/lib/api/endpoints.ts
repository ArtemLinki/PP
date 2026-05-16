/**
 * Реестр URL-эндпоинтов. Хранится в одном месте, чтобы случайно не разбежались
 * по разным сервисам и было удобно подменить префикс/версию.
 */
export const endpoints = {
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/slug/${slug}`,
  },
  categories: {
    list: "/categories",
    byId: (id: string) => `/categories/${id}`,
  },
  cart: {
    current: "/cart",
    items: "/cart/items",
    item: (itemId: string) => `/cart/items/${itemId}`,
    clear: "/cart",
  },
  orders: {
    list: "/orders",
    byId: (id: string) => `/orders/${id}`,
    create: "/orders",
  },
  ai: {
    chat: "/ai/chat",
    conversation: (id: string) => `/ai/conversations/${id}`,
  },
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
  admin: {
    dashboard: "/admin/dashboard",
    products: "/admin/products",
    product: (id: string) => `/admin/products/${id}`,
    productStatus: (id: string) => `/admin/products/${id}/status`,
    categories: "/admin/categories",
    category: (id: string) => `/admin/categories/${id}`,
    brands: "/admin/brands",
    brand: (id: string) => `/admin/brands/${id}`,
    orders: "/admin/orders",
    orderStatus: (id: string) => `/admin/orders/${id}/status`,
    users: "/admin/users",
  },
} as const;
