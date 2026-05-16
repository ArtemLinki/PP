import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus, Prisma } from '@prisma/client';

interface ProductQuery {
  search?: string;
  categoryId?: string;
  brandId?: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQuery = {}) {
    const {
      search, categoryId, brandId, priceMin, priceMax,
      inStockOnly, page = 1, pageSize = 24, sortBy = 'createdAt', sortDir = 'desc',
    } = query;

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.PUBLISHED,
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(priceMin !== undefined && { priceMinor: { gte: priceMin } }),
      ...(priceMax !== undefined && { priceMinor: { lte: priceMax } }),
      ...(inStockOnly && { stock: { gt: 0 } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price' ? { priceMinor: sortDir }
      : sortBy === 'name' ? { name: sortDir }
      : { createdAt: sortDir };

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { brand: true, category: true },
      }),
    ]);

    return {
      items: items.map(this.toDto),
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    };
  }

  async findById(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true },
    });
    if (!p) throw new NotFoundException('Товар не найден');
    return this.toDto(p);
  }

  async findBySlug(slug: string) {
    const p = await this.prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true },
    });
    if (!p) throw new NotFoundException('Товар не найден');
    return this.toDto(p);
  }

  private toDto(p: any) {
    const stockStatus =
      p.stock === 0 ? 'out_of_stock'
      : p.stock < 5 ? 'low_stock'
      : 'in_stock';

    const specs = p.specs && typeof p.specs === 'object'
      ? Object.entries(p.specs as Record<string, string>).map(([key, value]) => ({
          key, label: key, value: String(value),
        }))
      : [];

    return {
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      title: p.name,
      description: p.description,
      categoryId: p.categoryId,
      brandId: p.brandId,
      price: { amount: p.priceMinor, currency: 'RUB' as const },
      oldPrice: p.oldPriceMinor ? { amount: p.oldPriceMinor, currency: 'RUB' as const } : null,
      images: (p.images as string[]).map((url, i) => ({ id: `img-${i}`, url, isPrimary: i === 0 })),
      specs,
      tags: p.tags as string[],
      stockStatus,
      stockQty: p.stock,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
