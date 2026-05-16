import type { ID, ISODateString, PriceDto, PaginationQuery, SortQuery, Money } from './common.dto';

export interface SpecDto {
  key: string;
  label: string;
  value: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock';

export interface ProductImageDto {
  id: ID;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductDto {
  id: ID;
  sku: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description?: string;
  categoryId: ID;
  brandId?: ID;
  price: PriceDto;
  oldPrice?: PriceDto | null;
  images: ProductImageDto[];
  specs: SpecDto[];
  tags: string[];
  stockStatus: StockStatus;
  stockQty?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ProductListQuery extends PaginationQuery, SortQuery {
  categoryId?: ID;
  brandId?: ID;
  search?: string;
  tags?: string[];
  inStockOnly?: boolean;
  priceMin?: Money;
  priceMax?: Money;
}

export type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface CreateProductDto {
  title: string;
  sku: string;
  description?: string;
  price: PriceDto;
  oldPrice?: PriceDto;
  stockQty: number;
  status: ProductStatus;
  categoryId?: ID;
  brandId?: ID;
  images?: ProductImageDto[];
  specs?: SpecDto[];
  tags?: string[];
}
