import { httpClient, HttpClient } from '@/lib/api/http-client';
import { endpoints } from '@/lib/api/endpoints';
import type { ProductStatus } from '@/lib/dto';

// ─── Admin-specific types (raw backend shapes) ────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  description?: string | null;
  priceMinor: number;
  oldPriceMinor?: number | null;
  stock: number;
  status: ProductStatus;
  categoryId?: string | null;
  brandId?: string | null;
  images: string[];
  specs: any;
  tags: string[];
  createdAt: string;
  brand?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
}

export interface AdminProductsPage {
  items: AdminProduct[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CreateAdminProductDto {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  priceMinor: number;
  oldPriceMinor?: number;
  stock?: number;
  status?: ProductStatus;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  specs?: any;
  tags?: string[];
}

export type UpdateAdminProductDto = Partial<CreateAdminProductDto>;

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  isVisible: boolean;
  order: number;
}

export interface CreateAdminCategoryDto {
  name: string;
  slug: string;
  parentId?: string;
  isVisible?: boolean;
  order?: number;
}

export type UpdateAdminCategoryDto = Partial<CreateAdminCategoryDto>;

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  website?: string | null;
  logoUrl?: string | null;
}

export interface CreateAdminBrandDto {
  name: string;
  slug: string;
  country?: string;
  website?: string;
  logoUrl?: string;
}

export type UpdateAdminBrandDto = Partial<CreateAdminBrandDto>;

// ─── Service ──────────────────────────────────────────────────────────────────

export class AdminApiService {
  constructor(private readonly http: HttpClient = httpClient) {}

  // Products
  listProducts(page = 1, pageSize = 50) {
    return this.http.get<AdminProductsPage>(endpoints.admin.products, { params: { page, pageSize } });
  }

  createProduct(dto: CreateAdminProductDto) {
    return this.http.post<AdminProduct>(endpoints.admin.products, dto);
  }

  updateProduct(id: string, dto: UpdateAdminProductDto) {
    return this.http.patch<AdminProduct>(endpoints.admin.product(id), dto);
  }

  deleteProduct(id: string) {
    return this.http.delete<{ success: boolean }>(endpoints.admin.product(id));
  }

  // Categories
  listCategories() {
    return this.http.get<AdminCategory[]>(endpoints.admin.categories);
  }

  createCategory(dto: CreateAdminCategoryDto) {
    return this.http.post<AdminCategory>(endpoints.admin.categories, dto);
  }

  updateCategory(id: string, dto: UpdateAdminCategoryDto) {
    return this.http.patch<AdminCategory>(endpoints.admin.category(id), dto);
  }

  deleteCategory(id: string) {
    return this.http.delete<{ success: boolean }>(endpoints.admin.category(id));
  }

  // Brands
  listBrands() {
    return this.http.get<AdminBrand[]>(endpoints.admin.brands);
  }

  createBrand(dto: CreateAdminBrandDto) {
    return this.http.post<AdminBrand>(endpoints.admin.brands, dto);
  }

  updateBrand(id: string, dto: UpdateAdminBrandDto) {
    return this.http.patch<AdminBrand>(endpoints.admin.brand(id), dto);
  }

  deleteBrand(id: string) {
    return this.http.delete<{ success: boolean }>(endpoints.admin.brand(id));
  }
}

export const adminService = new AdminApiService();
