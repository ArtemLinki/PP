import { ID, ISODateString } from './common.dto';
import { ProductDto } from './product.dto';

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDto {
  id: ID;
  productId: ID;
  quantity: number;
  priceMinor: number;
  product: ProductDto;
}

export interface OrderDto {
  id: ID;
  userId: ID;
  status: OrderStatus;
  items: OrderItemDto[];
  totalMinor: number;
  createdAt: ISODateString;
}

export interface CreateOrderDto {
  cartId: string;
}
