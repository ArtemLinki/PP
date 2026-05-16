import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus, OrderStatus } from '@prisma/client';

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
}
