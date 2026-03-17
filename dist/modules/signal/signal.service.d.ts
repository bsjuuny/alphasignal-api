import { PrismaService } from '../prisma/prisma.service';
export declare class SignalService {
    private prisma;
    constructor(prisma: PrismaService);
    getLatestSignals(): Promise<({
        news: {
            id: string;
            url: string;
            title: string;
            summary: string;
            content: string | null;
            source: string;
            publishedAt: Date;
            sentiment: string;
            sentimentScore: number;
            impact: number;
            category: string;
            keywords: string[];
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        symbol: string;
        id: string;
        createdAt: Date;
        companyName: string | null;
        action: string;
        score: number;
        confidence: number;
        newsId: string;
    })[]>;
    getBuySignals(): Promise<({
        news: {
            id: string;
            url: string;
            title: string;
            summary: string;
            content: string | null;
            source: string;
            publishedAt: Date;
            sentiment: string;
            sentimentScore: number;
            impact: number;
            category: string;
            keywords: string[];
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        symbol: string;
        id: string;
        createdAt: Date;
        companyName: string | null;
        action: string;
        score: number;
        confidence: number;
        newsId: string;
    })[]>;
}
