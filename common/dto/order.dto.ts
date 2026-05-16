import type { ID, ISODateString, PriceDto } from './common.dto';
import type { ProductDto } from './product.dto';

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDto {
  id: ID;
  productId: ID;
  product?: ProductDto;
  quantity: number;
  unitPrice: PriceDto;
  lineTotal: PriceDto;
}

export interface OrderDto {
  id: ID;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: PriceDto;
  total: PriceDto;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateOrderDto {
  items: { productId: ID; quantity: number }[];
}
