import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';

@Module({
  imports: [PrismaModule, AnalyzerModule],
  providers: [CollectorService],
})
export class CollectorModule {}
