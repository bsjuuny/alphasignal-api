import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AnalysisResult } from './interfaces/analysis-result.interface';

@Injectable()
export class AnalyzerService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MY_OPENAI_API_KEY') || process.env.MY_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('MY_OPENAI_API_KEY is not defined in configuration.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeNews(title: string, summary: string): Promise<AnalysisResult> {
    const prompt = `당신은 금융 뉴스 분석 전문가이자 20년 경력의 퀀트 트레이더입니다. 
다음 제공되는 뉴스의 제목과 내용을 분석하여 투자 인사이트를 도출하고 JSON 형식으로 응답하세요.

[뉴스 데이터]
제목: "${title}"
요약: "${summary}"

[응답 가이드라인]
1. sentiment: 뉴스 전체의 심리를 POSITIVE, NEUTRAL, NEGATIVE 중 하나로 분류하세요.
2. sentimentScore: 심리 점수를 -1.0(매우 부정)에서 1.0(매우 긍정) 사이로 수치화하세요.
3. impact: 시장 또는 해당 기업에 미치는 영향력을 1(매우 낮음)에서 5(매우 높음)로 평가하세요.
4. category: 뉴스의 성격을 MACRO(거시경제), SECTOR(산업), COMPANY(개별기업) 중 하나로 분류하세요.
5. keywords: 뉴스에서 가장 중요한 키워드 3~5개를 추출하세요.
6. stockCode: 개별 기업 뉴스인 경우, 해당 기업의 KRX 종목코드(6자리 숫자)를 포함하세요. 없을 경우 null로 반환하세요.
7. companyName: 해당 기업의 정식 명칭을 포함하세요. 없을 경우 null로 반환하세요.
8. reasoning: 해당 분석의 주된 근거를 짧고 명확하게 기술하세요.

[응답 형식]
{
  "sentiment": "POSITIVE",
  "sentimentScore": 0.8,
  "impact": 4,
  "category": "COMPANY",
  "keywords": ["반도체", "삼성전자", "어닝서프라이즈"],
  "stockCode": "005930",
  "companyName": "삼성전자",
  "reasoning": "삼성전자의 분기 실적이 예상치를 상회하는 어닝 서프라이즈를 기록하여 긍정적인 주가 흐름이 예상됨."
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '당신은 금융 전문 분석 AI입니다.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Empty response from OpenAI');
      return JSON.parse(content) as AnalysisResult;
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error('Failed to analyze news via OpenAI');
    }
  }
}
