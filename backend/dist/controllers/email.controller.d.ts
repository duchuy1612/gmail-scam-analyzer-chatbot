import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';
import { AiService } from '../services/ai.service';
export declare class EmailController {
    private readonly aiService;
    constructor(aiService: AiService);
    analyzeEmail(analyzeEmailDto: AnalyzeEmailDto): Promise<EmailAnalysisResultDto>;
    bulkAnalyzeEmails(emails: AnalyzeEmailDto[]): Promise<EmailAnalysisResultDto[]>;
}
