/**
 * Точка входа в слой сервисов.
 *
 * Здесь собирается контейнер с реализациями: либо все Mock-сервисы, либо все
 * Api-сервисы. UI и хуки импортируют только `services` — об их природе не знают.
 *
 * Чтобы переопределить отдельный сервис в тесте — пересоздайте контейнер
 * через `createServices({ products: new MyFake() })`.
 */

import { apiConfig } from "@/lib/api/config";
import type { ServiceContainer } from "./types";

import { ProductsApiService } from "./products/ProductsApiService";
import { ProductsMockService } from "./products/ProductsMockService";
import { CategoriesApiService } from "./categories/CategoriesApiService";
import { CategoriesMockService } from "./categories/CategoriesMockService";
import { CartApiService } from "./cart/CartApiService";
import { CartMockService } from "./cart/CartMockService";
import { OrdersApiService } from "./orders/OrdersApiService";
import { OrdersMockService } from "./orders/OrdersMockService";
import { AiApiService } from "./ai/AiApiService";
import { AiMockService } from "./ai/AiMockService";
import { AuthApiService } from "./auth/AuthApiService";
import { AuthMockService } from "./auth/AuthMockService";

export function createServices(overrides: Partial<ServiceContainer> = {}): ServiceContainer {
  const useMocks = apiConfig.useMocks;

  const base: ServiceContainer = useMocks
    ? {
        products: new ProductsMockService(),
        categories: new CategoriesMockService(),
        cart: new CartMockService(),
        orders: new OrdersMockService(),
        ai: new AiMockService(),
        auth: new AuthMockService(),
      }
    : {
        products: new ProductsApiService(),
        categories: new CategoriesApiService(),
        cart: new CartApiService(),
        orders: new OrdersApiService(),
        ai: new AiApiService(),
        auth: new AuthApiService(),
      };

  return { ...base, ...overrides };
}

/** Готовый singleton-контейнер, импортируйте его в хуках и компонентах. */
export const services: ServiceContainer = createServices();

export type { ServiceContainer } from "./types";
export * from "./types";
