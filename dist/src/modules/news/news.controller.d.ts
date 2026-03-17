import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findAll(): Promise<({
        signals: {
            symbol: string | null;
            id: string;
            companyName: string | null;
            action: string;
            score: number;
            confidence: number;
            createdAt: Date;
            newsId: string;
        }[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
        signals: {
            symbol: string | null;
            id: string;
            companyName: string | null;
            action: string;
            score: number;
            confidence: number;
            createdAt: Date;
            newsId: string;
        }[];
    } & {
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
    }) | null>;
}
