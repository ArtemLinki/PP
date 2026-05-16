export type ID = string;
export type ISODateString = string;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
