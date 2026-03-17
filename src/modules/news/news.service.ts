import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        signals: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.news.findUnique({
      where: { id },
      include: {
        signals: true,
      },
    });
  }
}
