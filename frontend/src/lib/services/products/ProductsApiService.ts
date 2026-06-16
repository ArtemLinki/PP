import type { IProductsService } from "../types";
import type { ProductDto, ProductListQuery, Paginated, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class ProductsApiService implements IProductsService {
  constructor(private readonly http: HttpClient = httpClient) {}

  list(query?: ProductListQuery) {
    return this.http.get<Paginated<ProductDto>>(endpoints.products.list, { params: query });
  }

  getById(id: ID) {
    return this.http.get<ProductDto>(endpoints.products.byId(id));
  }

  getBySlug(slug: string) {
    return this.http.get<ProductDto>(endpoints.products.bySlug(slug));
  }
}
