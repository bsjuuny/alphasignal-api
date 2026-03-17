import { ConfigService } from '@nestjs/config';
import { AnalysisResult } from './interfaces/analysis-result.interface';
export declare class AnalyzerService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    analyzeNews(title: string, summary: string): Promise<AnalysisResult>;
}
