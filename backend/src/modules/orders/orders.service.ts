import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(this.toDto);
  }

  async findById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    if (order.userId !== userId) throw new ForbiddenException();
    return this.toDto(order);
  }

  async create(userId: string, productIds: { productId: string; quantity: number }[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds.map((p) => p.productId) } },
    });

    const totalMinor = productIds.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.priceMinor ?? 0) * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalMinor,
        items: {
          create: productIds.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              priceMinor: product.priceMinor,
            };
          }),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return this.toDto(order);
  }

  private toDto(order: any) {
    const items = order.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: { amount: item.priceMinor, currency: 'RUB' as const },
      lineTotal: { amount: item.priceMinor * item.quantity, currency: 'RUB' as const },
    }));

    const total = { amount: order.totalMinor, currency: 'RUB' as const };
    return {
      id: order.id,
      status: order.status as string,
      items,
      subtotal: total,
      total,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
