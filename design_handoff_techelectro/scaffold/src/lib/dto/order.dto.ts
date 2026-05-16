import type { ID, ISODateString, PriceDto } from "./common.dto";
import type { CartItemDto } from "./cart.dto";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddressDto {
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  city: string;
  zip: string;
  line1: string;
  line2?: string;
}

export interface OrderDto {
  id: ID;
  number: string;
  status: OrderStatus;
  items: CartItemDto[];
  subtotal: PriceDto;
  shipping: PriceDto;
  total: PriceDto;
  address: ShippingAddressDto;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateOrderDto {
  address: ShippingAddressDto;
  comment?: string;
}
