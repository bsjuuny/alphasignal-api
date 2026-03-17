export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type Category = 'MACRO' | 'SECTOR' | 'COMPANY';

export interface AnalysisResult {
  sentiment: Sentiment;
  sentimentScore: number;
  impact: number;
  category: Category;
  keywords: string[];
  stockCode?: string;
  companyName?: string;
  reasoning: string;
}
