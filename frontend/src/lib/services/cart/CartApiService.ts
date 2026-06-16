import type { ICartService } from "../types";
import type { CartDto, AddToCartDto, UpdateCartItemDto, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class CartApiService implements ICartService {
  constructor(private readonly http: HttpClient = httpClient) {}
  getCurrent() {
    return this.http.get<CartDto>(endpoints.cart.current);
  }
  addItem(payload: AddToCartDto) {
    return this.http.post<CartDto, AddToCartDto>(endpoints.cart.items, payload);
  }
  updateItem(payload: UpdateCartItemDto) {
    return this.http.patch<CartDto, { quantity: number }>(endpoints.cart.item(payload.itemId), {
      quantity: payload.quantity,
    });
  }
  removeItem(itemId: ID) {
    return this.http.delete<CartDto>(endpoints.cart.item(itemId));
  }
  clear() {
    return this.http.delete<CartDto>(endpoints.cart.clear);
  }
}
