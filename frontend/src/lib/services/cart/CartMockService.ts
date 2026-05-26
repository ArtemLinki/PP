import type { ICartService } from "../types";
import type { CartDto, AddToCartDto, UpdateCartItemDto, CartItemDto, PriceDto, ID } from "@/lib/dto";
import { mockProducts } from "@/lib/mocks/products.mock";
import { delay, nextId } from "../_utils";

const RUB = (amount: number): PriceDto => ({ amount, currency: "RUB" });

function recompute(items: CartItemDto[]): Pick<CartDto, "subtotal" | "discount" | "total"> {
  const sub = items.reduce((acc, i) => acc + i.lineTotal.amount, 0);
  return {
    subtotal: RUB(sub),
    discount: RUB(0),
    total: RUB(sub),
  };
}

export class CartMockService implements ICartService {
  private cart: CartDto = {
    id: "mock-cart",
    items: [],
    subtotal: RUB(0),
    discount: RUB(0),
    total: RUB(0),
    updatedAt: new Date().toISOString(),
  };

  async getCurrent(): Promise<CartDto> {
    await delay();
    return this.snapshot();
  }

  async addItem(payload: AddToCartDto): Promise<CartDto> {
    await delay();
    const qty = payload.quantity ?? 1;
    const product = mockProducts.find((p) => p.id === payload.productId);
    if (!product) throw { code: "NOT_FOUND", message: "Товар не найден" };

    const existing = this.cart.items.find((i) => i.productId === payload.productId);
    if (existing) {
      existing.quantity += qty;
      existing.lineTotal = RUB(existing.unitPrice.amount * existing.quantity);
    } else {
      const item: CartItemDto = {
        id: nextId("ci"),
        productId: product.id,
        product,
        quantity: qty,
        unitPrice: product.price,
        lineTotal: RUB(product.price.amount * qty),
        addedAt: new Date().toISOString(),
      };
      this.cart.items.push(item);
    }
    this.persistTotals();
    return this.snapshot();
  }

  async updateItem(payload: UpdateCartItemDto): Promise<CartDto> {
    await delay();
    const item = this.cart.items.find((i) => i.id === payload.itemId);
    if (!item) throw { code: "NOT_FOUND", message: "Позиция корзины не найдена" };
    item.quantity = Math.max(1, payload.quantity);
    item.lineTotal = RUB(item.unitPrice.amount * item.quantity);
    this.persistTotals();
    return this.snapshot();
  }

  async removeItem(itemId: ID): Promise<CartDto> {
    await delay();
    this.cart.items = this.cart.items.filter((i) => i.id !== itemId);
    this.persistTotals();
    return this.snapshot();
  }

  async clear(): Promise<CartDto> {
    await delay();
    this.cart.items = [];
    this.persistTotals();
    return this.snapshot();
  }

  private persistTotals() {
    Object.assign(this.cart, recompute(this.cart.items));
    this.cart.updatedAt = new Date().toISOString();
  }

  private snapshot(): CartDto {
    return JSON.parse(JSON.stringify(this.cart));
  }
}
