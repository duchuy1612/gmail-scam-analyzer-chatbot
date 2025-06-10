import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';
import { AiService } from '../services/ai.service';
import { EmailAnalysisService } from '../services/email-analysis.service';
export declare class EmailController {
    private readonly aiService;
    private readonly emailAnalysisService;
    constructor(aiService: AiService, emailAnalysisService: EmailAnalysisService);
    analyzeEmail(analyzeEmailDto: AnalyzeEmailDto, req: any): Promise<EmailAnalysisResultDto>;
    getAnalysisHistory(req: any): Promise<import("../entities/email-analysis.entity").EmailAnalysis[]>;
    getAnalysisStats(req: any): Promise<any>;
    getAnalysis(id: string): Promise<import("../entities/email-analysis.entity").EmailAnalysis>;
    bulkAnalyzeEmails(emails: AnalyzeEmailDto[], req: any): Promise<EmailAnalysisResultDto[]>;
}
