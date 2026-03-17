import { PrismaService } from '../prisma/prisma.service';
import { AnalyzerService } from '../analyzer/analyzer.service';
export declare class CollectorService {
    private prisma;
    private analyzer;
    private readonly logger;
    private parser;
    private feeds;
    constructor(prisma: PrismaService, analyzer: AnalyzerService);
    collectNews(): Promise<void>;
    private processNewsItem;
    private generateSignal;
}
