import type { ICategoriesService } from "../types";
import type { CategoryDto, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class CategoriesApiService implements ICategoriesService {
  constructor(private readonly http: HttpClient = httpClient) {}
  list() {
    return this.http.get<CategoryDto[]>(endpoints.categories.list);
  }
  getById(id: ID) {
    return this.http.get<CategoryDto>(endpoints.categories.byId(id));
  }
}
