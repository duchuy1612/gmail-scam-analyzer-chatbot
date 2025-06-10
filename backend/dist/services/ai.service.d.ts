import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';
export declare class AiService {
    private readonly aiServiceUrl;
    analyzeEmail(emailData: AnalyzeEmailDto): Promise<EmailAnalysisResultDto>;
    bulkAnalyzeEmails(emails: AnalyzeEmailDto[]): Promise<EmailAnalysisResultDto[]>;
    sendChatMessage(message: string, sessionId?: string, context?: string[]): Promise<any>;
    healthCheck(): Promise<any>;
}
