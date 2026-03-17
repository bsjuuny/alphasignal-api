import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectorModule } from './modules/collector/collector.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';
import { SignalModule } from './modules/signal/signal.module';
import { ThemeModule } from './modules/theme/theme.module';
import { MarketModule } from './modules/market/market.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CollectorModule,
    AnalyzerModule,
    SignalModule,
    ThemeModule,
    MarketModule,
    PrismaModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
