import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus, OrderStatus } from '@prisma/client';

export interface CreateProductDto {
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

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  priceMinor?: number;
  oldPriceMinor?: number;
  stock?: number;
  status?: ProductStatus;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  specs?: any;
  tags?: string[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  parentId?: string;
  isVisible?: boolean;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
  isVisible?: boolean;
  order?: number;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  country?: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateBrandDto {
  name?: string;
  slug?: string;
  country?: string;
  website?: string;
  logoUrl?: string;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      productsTotal,
      ordersTotal,
      revenueAgg,
      aiRequestsTotal,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { totalMinor: true } }),
      this.prisma.aiMessage.count(),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { email: true } } },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const topProductIds = topProducts.map((tp) => tp.productId);
    const topProductDetails = await this.prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });

    const topProductsResult = topProducts.map((tp) => {
      const detail = topProductDetails.find((p) => p.id === tp.productId);
      return {
        id: tp.productId,
        title: detail?.name ?? '',
        soldCount: tp._sum.quantity ?? 0,
      };
    });

    return {
      productsTotal,
      ordersTotal,
      revenueTotal: {
        amount: revenueAgg._sum.totalMinor ?? 0,
        currency: 'RUB',
      },
      aiRequestsTotal,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        status: o.status,
        total: { amount: o.totalMinor, currency: 'RUB' },
        createdAt: o.createdAt.toISOString(),
        userEmail: o.user.email,
      })),
      topProducts: topProductsResult,
    };
  }

  async updateProductStatus(id: string, status: ProductStatus) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Товар не найден');

    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Заказ не найден');

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  // ─── Products CRUD ────────────────────────────────────────────────────────

  async listProducts(page = 1, pageSize = 20, search?: string, status?: ProductStatus) {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
        include: { brand: { select: { id: true, name: true } }, category: { select: { id: true, name: true } } },
      }),
    ]);
    return { items, total, page, pageSize, hasMore: page * pageSize < total };
  }

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        shortDescription: dto.shortDescription,
        description: dto.description,
        priceMinor: dto.priceMinor,
        oldPriceMinor: dto.oldPriceMinor,
        stock: dto.stock ?? 0,
        status: dto.status ?? ProductStatus.DRAFT,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        images: dto.images ?? [],
        specs: dto.specs ?? {},
        tags: dto.tags ?? [],
      },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Товар не найден');

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priceMinor !== undefined && { priceMinor: dto.priceMinor }),
        ...(dto.oldPriceMinor !== undefined && { oldPriceMinor: dto.oldPriceMinor }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.brandId !== undefined && { brandId: dto.brandId }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.specs !== undefined && { specs: dto.specs }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
      },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Товар не найден');

    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  // ─── Categories CRUD ──────────────────────────────────────────────────────

  async listCategories() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId,
        isVisible: dto.isVisible ?? true,
        order: dto.order ?? 0,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Категория не найдена');

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId }),
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Категория не найдена');

    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  // ─── Brands CRUD ──────────────────────────────────────────────────────────

  async listBrands() {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }

  async createBrand(dto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        country: dto.country,
        website: dto.website,
        logoUrl: dto.logoUrl,
      },
    });
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Бренд не найден');

    return this.prisma.brand.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
      },
    });
  }

  async deleteBrand(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Бренд не найден');

    await this.prisma.brand.delete({ where: { id } });
    return { success: true };
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async listOrders(page = 1, pageSize = 50, userId?: string, status?: OrderStatus) {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        status: o.status,
        totalMinor: o.totalMinor,
        createdAt: o.createdAt.toISOString(),
        userEmail: o.user.email,
        itemsCount: o._count.items,
        deliveryName: o.deliveryName,
        deliveryPhone: o.deliveryPhone,
        deliveryCity: o.deliveryCity,
      })),
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    };
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async listUsers(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true, phone: true },
      }),
    ]);
    return { items, total, page, pageSize, hasMore: page * pageSize < total };
  }
}
