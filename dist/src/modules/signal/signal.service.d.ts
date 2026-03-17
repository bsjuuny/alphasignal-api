import { PrismaService } from '../prisma/prisma.service';
export declare class SignalService {
    private prisma;
    constructor(prisma: PrismaService);
    getLatestSignals(): Promise<({
        news: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
        };
    } & {
        symbol: string | null;
        id: string;
        companyName: string | null;
        action: string;
        score: number;
        confidence: number;
        createdAt: Date;
        newsId: string;
    })[]>;
    getBuySignals(): Promise<({
        news: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
        };
    } & {
        symbol: string | null;
        id: string;
        companyName: string | null;
        action: string;
        score: number;
        confidence: number;
        createdAt: Date;
        newsId: string;
    })[]>;
}
