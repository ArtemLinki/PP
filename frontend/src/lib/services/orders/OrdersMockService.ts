import type { IOrdersService } from "../types";
import type { OrderDto, CreateOrderDto, ID, PriceDto } from "@/lib/dto";
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

  async create(_payload: CreateOrderDto): Promise<OrderDto> {
    await delay();
    const now = new Date().toISOString();
    const order: OrderDto = {
      id: nextId("ord"),
      status: "PENDING",
      items: [],
      subtotal: RUB(0),
      total: RUB(0),
      createdAt: now,
      updatedAt: now,
    };
    this.orders.unshift(order);
    return order;
  }
}
