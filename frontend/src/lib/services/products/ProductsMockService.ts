import type { IProductsService } from "../types";
import type { ProductDto, ProductListQuery, Paginated, ID } from "@/lib/dto";
import { mockProducts } from "@/lib/mocks/products.mock";
import { delay } from "../_utils";

export class ProductsMockService implements IProductsService {
  private readonly products = [...mockProducts];

  async list(query: ProductListQuery = {}): Promise<Paginated<ProductDto>> {
    await delay();
    let items = this.products;

    if (query.categoryId) items = items.filter((p) => p.categoryId === query.categoryId);
    if (query.brandId) items = items.filter((p) => p.brandId === query.brandId);
    if (query.inStockOnly) items = items.filter((p) => p.stockStatus !== "out_of_stock");
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const total = items.length;
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    return {
      items: slice,
      page,
      pageSize,
      total,
      hasMore: start + slice.length < total,
    };
  }

  async getById(id: ID): Promise<ProductDto> {
    await delay();
    const found = this.products.find((p) => p.id === id);
    if (!found) throw { code: "NOT_FOUND", message: "Товар не найден" };
    return found;
  }

  async getBySlug(slug: string): Promise<ProductDto> {
    await delay();
    const found = this.products.find((p) => p.slug === slug);
    if (!found) throw { code: "NOT_FOUND", message: "Товар не найден" };
    return found;
  }
}
