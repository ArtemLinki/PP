import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    }).then((brands) => brands.map((b) => ({
      id: b.id, slug: b.slug, title: b.name,
      country: b.country, website: b.website, logoUrl: b.logoUrl,
    })));
  }

  findById(id: string) {
    return this.prisma.brand.findUniqueOrThrow({ where: { id } })
      .then((b) => ({ id: b.id, slug: b.slug, title: b.name, country: b.country, website: b.website, logoUrl: b.logoUrl }));
  }
}
