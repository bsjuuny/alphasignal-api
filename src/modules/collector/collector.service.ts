import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Parser from 'rss-parser';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyzerService } from '../analyzer/analyzer.service';

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);
  private parser = new Parser();

  private feeds = [
    { name: 'Hankyung Economy', url: 'https://fs.hankyung.com/v1/naver/economy' },
    { name: 'MK Economy', url: 'https://www.mk.co.kr/rss/30100041/' },
    // { name: 'Reuters Business', url: 'http://feeds.reuters.com/reuters/businessNews' }, // Proxy or direct might needed
  ];

  constructor(
    private prisma: PrismaService,
    private analyzer: AnalyzerService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectNews() {
    this.logger.log('Starting news collection...');
    
    for (const feed of this.feeds) {
      try {
        const data = await this.parser.parseURL(feed.url);
        this.logger.log(`Fetched ${data.items.length} news items from ${feed.name}`);

        for (const item of data.items) {
          await this.processNewsItem(item, feed.name);
        }
      } catch (error) {
        this.logger.error(`Failed to fetch feed ${feed.name}: ${error.message}`);
      }
    }
  }

  private async processNewsItem(item: Parser.Item, source: string) {
    if (!item.link || !item.title) return;

    // Check for duplicates
    const exists = await this.prisma.news.findUnique({
      where: { url: item.link },
    });

    if (exists) return;

    this.logger.log(`Analyzing new item: ${item.title}`);
    
    try {
      // Analyze with AI
      const analysis = await this.analyzer.analyzeNews(
        item.title,
        item.contentSnippet || item.content || '',
      );

      // Save News
      const savedNews = await this.prisma.news.create({
        data: {
          title: item.title,
          summary: item.contentSnippet || item.content || '',
          source: source,
          url: item.link,
          publishedAt: new Date(item.pubDate || Date.now()),
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentimentScore,
          impact: analysis.impact,
          category: analysis.category,
          keywords: analysis.keywords,
        },
      });

      // If it's a company news, generate signal
      if (analysis.stockCode && analysis.companyName) {
        await this.generateSignal(savedNews.id, analysis);
      }
    } catch (error) {
      this.logger.error(`Failed to process news item ${item.title}: ${error.message}`);
    }
  }

  private async generateSignal(newsId: string, analysis: any) {
    // Basic Signal Logic
    // BUY: Positive sentiment + Impact >= 4
    // SELL: Negative sentiment + Impact >= 4
    // HOLD: Otherwise
    let action = 'HOLD';
    let score = 50;
    let confidence = 0.5;

    if (analysis.sentiment === 'POSITIVE' && analysis.impact >= 4) {
      action = 'BUY';
      score = 70 + (analysis.impact * 5);
      confidence = 0.7 + (analysis.sentimentScore * 0.2);
    } else if (analysis.sentiment === 'NEGATIVE' && analysis.impact >= 4) {
      action = 'SELL';
      score = 70 + (analysis.impact * 5);
      confidence = 0.7 + (Math.abs(analysis.sentimentScore) * 0.2);
    }

    await this.prisma.signal.create({
      data: {
        newsId,
        symbol: analysis.stockCode,
        companyName: analysis.companyName,
        action,
        score: Math.min(Math.round(score), 100),
        confidence: Math.min(confidence, 1.0),
      },
    });

    this.logger.log(`Generated ${action} signal for ${analysis.companyName} (${analysis.stockCode})`);
  }
}
