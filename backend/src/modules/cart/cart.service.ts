import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCurrent(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    return this.toDto(cart);
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Товар не найден');

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId } });

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return this.getCurrent(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== userId) throw new NotFoundException('Позиция не найдена');

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }
    return this.getCurrent(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== userId) throw new NotFoundException('Позиция не найдена');
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCurrent(userId);
  }

  async clear(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCurrent(userId);
  }

  private toDto(cart: any) {
    const items = cart.items.map((item: any) => {
      const unitPrice = { amount: item.product.priceMinor, currency: 'RUB' as const };
      const lineTotal = { amount: item.product.priceMinor * item.quantity, currency: 'RUB' as const };
      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        addedAt: item.createdAt.toISOString(),
        product: item.product ? {
          id: item.product.id,
          sku: item.product.sku,
          slug: item.product.slug,
          title: item.product.name,
          price: unitPrice,
          images: (item.product.images as string[]).map((url: string, i: number) => ({ id: `img-${i}`, url, isPrimary: i === 0 })),
          categoryId: item.product.categoryId,
          specs: [],
          tags: item.product.tags,
          stockStatus: item.product.stock === 0 ? 'out_of_stock' : item.product.stock < 5 ? 'low_stock' : 'in_stock',
          stockQty: item.product.stock,
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
        } : undefined,
      };
    });

    const subtotal = items.reduce((s: number, i: any) => s + i.lineTotal.amount, 0);
    return {
      id: cart.id,
      items,
      subtotal: { amount: subtotal, currency: 'RUB' as const },
      discount: { amount: 0, currency: 'RUB' as const },
      total: { amount: subtotal, currency: 'RUB' as const },
      updatedAt: cart.updatedAt.toISOString(),
    };
  }
}
