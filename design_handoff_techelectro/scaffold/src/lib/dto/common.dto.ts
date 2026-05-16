/**
 * Общие DTO и утилитарные типы, используемые во всём API.
 */

export type ID = string;
export type ISODateString = string;

/** Стандартная обёртка ответа REST API. */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  requestId?: string;
  timestamp?: ISODateString;
}

/** Пагинированный список. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Параметры запроса списков. */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export type Money = number; // храним в минорных единицах (копейки), форматируем на UI

export interface PriceDto {
  amount: Money;
  currency: "RUB" | "USD" | "EUR";
}

export interface ApiErrorDto {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
