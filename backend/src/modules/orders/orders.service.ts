import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DeliveryInfo {
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
}

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

  async create(
    userId: string,
    productIds: { productId: string; quantity: number }[],
    delivery?: DeliveryInfo,
  ) {
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
        deliveryName: delivery?.deliveryName,
        deliveryPhone: delivery?.deliveryPhone,
        deliveryCity: delivery?.deliveryCity,
        deliveryAddress: delivery?.deliveryAddress,
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

    // Clear the cart after successful order
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return this.toDto(order);
  }

  async getLastDelivery(userId: string): Promise<DeliveryInfo | null> {
    const lastOrder = await this.prisma.order.findFirst({
      where: { userId, deliveryName: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: { deliveryName: true, deliveryPhone: true, deliveryCity: true, deliveryAddress: true },
    });
    if (!lastOrder) return null;
    return {
      deliveryName: lastOrder.deliveryName ?? undefined,
      deliveryPhone: lastOrder.deliveryPhone ?? undefined,
      deliveryCity: lastOrder.deliveryCity ?? undefined,
      deliveryAddress: lastOrder.deliveryAddress ?? undefined,
    };
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
      delivery: {
        name: order.deliveryName ?? null,
        phone: order.deliveryPhone ?? null,
        city: order.deliveryCity ?? null,
        address: order.deliveryAddress ?? null,
      },
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
