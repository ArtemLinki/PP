import { httpClient, HttpClient } from '@/lib/api/http-client';
import { endpoints } from '@/lib/api/endpoints';
import type { ProductStatus, OrderStatus, PriceDto } from '@/lib/dto';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminDashboardRecentOrder {
  id: string;
  status: OrderStatus;
  total: PriceDto;
  createdAt: string;
  userEmail?: string;
}

export interface AdminDashboardTopProduct {
  id: string;
  title: string;
  soldCount: number;
}

export interface AdminDashboard {
  productsTotal: number;
  ordersTotal: number;
  revenueTotal: PriceDto;
  aiRequestsTotal: number;
  recentOrders: AdminDashboardRecentOrder[];
  topProducts: AdminDashboardTopProduct[];
}

// ─── Admin users ──────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt: string;
  phone?: string | null;
}

export interface AdminUsersPage {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Admin orders ─────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: string;
  status: OrderStatus;
  totalMinor: number;
  createdAt: string;
  userEmail: string;
  itemsCount: number;
  deliveryName?: string | null;
  deliveryPhone?: string | null;
  deliveryCity?: string | null;
}

export interface AdminOrdersPage {
  items: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

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

  // Dashboard
  getDashboard() {
    return this.http.get<AdminDashboard>(endpoints.admin.dashboard);
  }

  // Orders (admin)
  listOrders(page = 1, pageSize = 20, userId?: string, status?: OrderStatus) {
    return this.http.get<AdminOrdersPage>(endpoints.admin.orders, {
      params: { page, pageSize, ...(userId && { userId }), ...(status && { status }) },
    });
  }

  listUsers(page = 1, pageSize = 100) {
    return this.http.get<AdminUsersPage>(endpoints.admin.users, { params: { page, pageSize } });
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.http.patch<{ id: string; status: OrderStatus }>(
      endpoints.admin.orderStatus(id),
      { status },
    );
  }

  // Images
  async uploadImage(file: File, bucket: 'products' | 'avatars' = 'products'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    const result = await this.http.post<{ url: string }>(
      '/files/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return result.url;
  }

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
