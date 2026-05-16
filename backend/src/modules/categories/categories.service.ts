import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const cats = await this.prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      include: {
        children: { where: { isVisible: true }, orderBy: { order: 'asc' } },
        _count: { select: { products: true } },
      },
    });
    return cats
      .filter((c) => !c.parentId)
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.name,
        productCount: c._count.products,
        children: c.children.map((ch) => ({
          id: ch.id,
          slug: ch.slug,
          title: ch.name,
        })),
      }));
  }

  async findById(id: string) {
    const c = await this.prisma.category.findUniqueOrThrow({ where: { id } });
    return { id: c.id, slug: c.slug, title: c.name };
  }
}
