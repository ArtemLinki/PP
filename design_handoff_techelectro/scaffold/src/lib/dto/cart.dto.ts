import type { ID, ISODateString, PriceDto } from "./common.dto";
import type { ProductDto } from "./product.dto";

export interface CartItemDto {
  id: ID;
  productId: ID;
  product?: ProductDto;
  quantity: number;
  unitPrice: PriceDto;
  lineTotal: PriceDto;
  addedAt: ISODateString;
}

export interface CartDto {
  id: ID;
  items: CartItemDto[];
  subtotal: PriceDto;
  discount: PriceDto;
  total: PriceDto;
  updatedAt: ISODateString;
}

export interface AddToCartDto {
  productId: ID;
  quantity?: number;
}

export interface UpdateCartItemDto {
  itemId: ID;
  quantity: number;
}
