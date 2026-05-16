export type ID = string;
export type ISODateString = string;
export type Money = number; // minor units (kopecks)

export interface PriceDto {
  amount: Money;
  currency: 'RUB' | 'USD' | 'EUR';
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  requestId?: string;
  timestamp?: ISODateString;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ApiErrorDto {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
