"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CollectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const rss_parser_1 = __importDefault(require("rss-parser"));
const prisma_service_1 = require("../prisma/prisma.service");
const analyzer_service_1 = require("../analyzer/analyzer.service");
let CollectorService = CollectorService_1 = class CollectorService {
    prisma;
    analyzer;
    logger = new common_1.Logger(CollectorService_1.name);
    parser = new rss_parser_1.default();
    feeds = [
        { name: 'Hankyung Economy', url: 'https://fs.hankyung.com/v1/naver/economy' },
        { name: 'MK Economy', url: 'https://www.mk.co.kr/rss/30100041/' },
    ];
    constructor(prisma, analyzer) {
        this.prisma = prisma;
        this.analyzer = analyzer;
    }
    async collectNews() {
        this.logger.log('Starting news collection...');
        for (const feed of this.feeds) {
            try {
                const data = await this.parser.parseURL(feed.url);
                this.logger.log(`Fetched ${data.items.length} news items from ${feed.name}`);
                for (const item of data.items) {
                    await this.processNewsItem(item, feed.name);
                }
            }
            catch (error) {
                this.logger.error(`Failed to fetch feed ${feed.name}: ${error.message}`);
            }
        }
    }
    async processNewsItem(item, source) {
        if (!item.link || !item.title)
            return;
        const exists = await this.prisma.news.findUnique({
            where: { url: item.link },
        });
        if (exists)
            return;
        this.logger.log(`Analyzing new item: ${item.title}`);
        try {
            const analysis = await this.analyzer.analyzeNews(item.title, item.contentSnippet || item.content || '');
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
            if (analysis.stockCode && analysis.companyName) {
                await this.generateSignal(savedNews.id, analysis);
            }
        }
        catch (error) {
            this.logger.error(`Failed to process news item ${item.title}: ${error.message}`);
        }
    }
    async generateSignal(newsId, analysis) {
        let action = 'HOLD';
        let score = 50;
        let confidence = 0.5;
        if (analysis.sentiment === 'POSITIVE' && analysis.impact >= 4) {
            action = 'BUY';
            score = 70 + (analysis.impact * 5);
            confidence = 0.7 + (analysis.sentimentScore * 0.2);
        }
        else if (analysis.sentiment === 'NEGATIVE' && analysis.impact >= 4) {
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
};
exports.CollectorService = CollectorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CollectorService.prototype, "collectNews", null);
exports.CollectorService = CollectorService = CollectorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analyzer_service_1.AnalyzerService])
], CollectorService);
//# sourceMappingURL=collector.service.js.map