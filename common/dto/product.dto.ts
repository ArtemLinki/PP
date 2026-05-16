import { ID, ISODateString } from './common.dto';

export type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface ProductDto {
  id: ID;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  priceMinor: number;
  oldPriceMinor?: number;
  stock: number;
  status: ProductStatus;
  categoryId?: ID;
  brandId?: ID;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  createdAt: ISODateString;
}

export interface ProductListQuery {
  q?: string;
  categoryId?: string;
  brandId?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  priceMinor: number;
  oldPriceMinor?: number;
  stock: number;
  status: ProductStatus;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  specs?: Record<string, string>;
  tags?: string[];
}
