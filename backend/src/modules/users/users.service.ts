import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async updateMe(userId: string, data: { name?: string; phone?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
