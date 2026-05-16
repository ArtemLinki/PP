import { ID } from './common.dto';
import { ProductDto } from './product.dto';

export interface CartItemDto {
  id: ID;
  productId: ID;
  quantity: number;
  product: ProductDto;
}

export interface CartDto {
  id: ID;
  items: CartItemDto[];
  totalMinor: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
