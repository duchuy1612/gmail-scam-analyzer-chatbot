import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async analyzeEmail(emailData: AnalyzeEmailDto): Promise<EmailAnalysisResultDto> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/analyze-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new HttpException(
          'AI service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const result = await response.json();
      
      // Transform AI service response to match our DTO
      return {
        scamProbability: result.scam_probability || result.scamProbability,
        riskLevel: result.risk_level || result.riskLevel,
        explanation: result.explanation,
        redFlags: result.red_flags || result.redFlags || [],
        confidence: result.confidence,
        analyzedAt: new Date().toISOString(),
        analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      } as EmailAnalysisResultDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('AI Service Error:', error);
      throw new HttpException(
        'Failed to analyze email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkAnalyzeEmails(emails: AnalyzeEmailDto[]): Promise<EmailAnalysisResultDto[]> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/bulk-analyze-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        throw new HttpException(
          'AI service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const results = await response.json();
      
      // Transform AI service response to match our DTO
      return results.map((result: any, index: number) => ({
        scamProbability: result.scam_probability || result.scamProbability,
        riskLevel: result.risk_level || result.riskLevel,
        explanation: result.explanation,
        redFlags: result.red_flags || result.redFlags || [],
        confidence: result.confidence,
        analyzedAt: new Date().toISOString(),
        analysisId: `analysis_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      } as EmailAnalysisResultDto));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('AI Service Error:', error);
      throw new HttpException(
        'Failed to analyze emails',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendChatMessage(message: string, sessionId?: string, context?: string[]): Promise<any> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          context,
        }),
      });

      if (!response.ok) {
        throw new HttpException(
          'AI chat service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const result = await response.json();
      
      return {
        response: result.response,
        sessionId: result.session_id || sessionId || `session_${Date.now()}`,
        suggestions: result.suggestions || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('AI Chat Service Error:', error);
      throw new HttpException(
        'Failed to process chat message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        return { status: 'unhealthy', message: 'AI service not responding' };
      }

      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', message: 'AI service connection failed' };
    }
  }
}
