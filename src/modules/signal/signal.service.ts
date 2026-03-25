import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SignalService {
  constructor(private prisma: PrismaService) {}

  private getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { gte: start, lte: end };
  }

  async getLatestSignals() {
    return this.prisma.signal.findMany({
      where: { createdAt: this.getTodayRange() },
      orderBy: { createdAt: 'desc' },
      include: { news: true },
    });
  }

  async getBuySignals() {
    return this.prisma.signal.findMany({
      where: { action: 'BUY', createdAt: this.getTodayRange() },
      orderBy: { createdAt: 'desc' },
      include: { news: true },
    });
  }

  async getAllSignals() {
    return this.prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
      include: { news: true },
    });
  }
}
