import type { ICategoriesService } from "../types";
import type { CategoryDto, ID } from "@/lib/dto";
import { mockCategories } from "@/lib/mocks/categories.mock";
import { delay } from "../_utils";

export class CategoriesMockService implements ICategoriesService {
  async list(): Promise<CategoryDto[]> {
    await delay();
    return mockCategories;
  }
  async getById(id: ID): Promise<CategoryDto> {
    await delay();
    const cat = mockCategories.find((c) => c.id === id);
    if (!cat) throw { code: "NOT_FOUND", message: "Категория не найдена" };
    return cat;
  }
}
