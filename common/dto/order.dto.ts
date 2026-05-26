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

export interface OrderDeliveryDto {
  name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
}

export interface OrderDto {
  id: ID;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: PriceDto;
  total: PriceDto;
  delivery?: OrderDeliveryDto;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DeliveryInfoDto {
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
}

export interface CreateOrderDto {
  items: { productId: ID; quantity: number }[];
  delivery?: DeliveryInfoDto;
}
