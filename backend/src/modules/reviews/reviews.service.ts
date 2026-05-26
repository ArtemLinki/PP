import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map(this.toDto);
  }

  async create(userId: string, productId: string, rating: number, comment?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Товар не найден');

    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existing) throw new ConflictException('Вы уже оставили отзыв на этот товар');

    const review = await this.prisma.review.create({
      data: { productId, userId, rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });
    return this.toDto(review);
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId) throw new ForbiddenException();
    await this.prisma.review.delete({ where: { id: reviewId } });
  }

  private toDto(review: any) {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      authorName: review.user?.name ?? 'Аноним',
      rating: review.rating,
      comment: review.comment ?? null,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
