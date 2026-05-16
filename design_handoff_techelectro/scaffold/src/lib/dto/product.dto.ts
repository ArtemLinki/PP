import type { ID, ISODateString, PriceDto, PaginationQuery, SortQuery, Money } from "./common.dto";

/** Категория каталога (микроконтроллеры, сенсоры, питание и т.п.). */
export interface CategoryDto {
  id: ID;
  slug: string;
  title: string;
  parentId?: ID | null;
  iconKey?: string;
  productCount?: number;
}

/** Бренд / производитель. */
export interface BrandDto {
  id: ID;
  slug: string;
  title: string;
}

/** Спецификация: ключ-значение для карточки товара. */
export interface SpecDto {
  key: string;
  label: string;
  value: string;
}

export type StockStatus = "in_stock" | "low_stock" | "preorder" | "out_of_stock";

export interface ProductImageDto {
  id: ID;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

/** Основная сущность товара. */
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
