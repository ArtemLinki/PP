import type { IOrdersService } from "../types";
import type { OrderDto, CreateOrderDto, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class OrdersApiService implements IOrdersService {
  constructor(private readonly http: HttpClient = httpClient) {}
  list() {
    return this.http.get<OrderDto[]>(endpoints.orders.list);
  }
  getById(id: ID) {
    return this.http.get<OrderDto>(endpoints.orders.byId(id));
  }
  create(payload: CreateOrderDto) {
    return this.http.post<OrderDto, CreateOrderDto>(endpoints.orders.create, payload);
  }
}
