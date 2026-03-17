import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SignalService {
  constructor(private prisma: PrismaService) {}

  async getLatestSignals() {
    return this.prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        news: true,
      },
    });
  }

  async getBuySignals() {
    return this.prisma.signal.findMany({
      where: { action: 'BUY' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        news: true,
      },
    });
  }
}
