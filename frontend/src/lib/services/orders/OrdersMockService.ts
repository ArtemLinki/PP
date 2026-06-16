import type { IOrdersService } from "../types";
import type { OrderDto, CreateOrderDto, DeliveryInfoDto, ID, PriceDto } from "@/lib/dto";
import { delay, nextId } from "../_utils";

const RUB = (amount: number): PriceDto => ({ amount, currency: "RUB" });

export class OrdersMockService implements IOrdersService {
  private readonly orders: OrderDto[] = [];

  async list(): Promise<OrderDto[]> {
    await delay();
    return [...this.orders];
  }

  async getById(id: ID): Promise<OrderDto> {
    await delay();
    const found = this.orders.find((o) => o.id === id);
    if (!found) throw { code: "NOT_FOUND", message: "Заказ не найден" };
    return found;
  }

  async create(payload: CreateOrderDto): Promise<OrderDto> {
    await delay();
    const now = new Date().toISOString();
    const total = RUB(0);
    const order: OrderDto = {
      id: nextId("ord"),
      status: "PENDING",
      items: payload.items.map((i) => ({
        id: nextId("oi"),
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: RUB(0),
        lineTotal: RUB(0),
      })),
      subtotal: total,
      total,
      delivery: payload.delivery ? {
        name: payload.delivery.deliveryName ?? null,
        phone: payload.delivery.deliveryPhone ?? null,
        city: payload.delivery.deliveryCity ?? null,
        address: payload.delivery.deliveryAddress ?? null,
      } : undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.unshift(order);
    if (payload.delivery) {
      this.lastDelivery = {
        deliveryName: payload.delivery.deliveryName,
        deliveryPhone: payload.delivery.deliveryPhone,
        deliveryCity: payload.delivery.deliveryCity,
        deliveryAddress: payload.delivery.deliveryAddress,
      };
    }
    return order;
  }

  async getLastDelivery(): Promise<DeliveryInfoDto | null> {
    await delay(80);
    return this.lastDelivery;
  }

  private lastDelivery: DeliveryInfoDto | null = null;
}
