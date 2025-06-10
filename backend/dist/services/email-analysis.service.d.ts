import { Repository } from 'typeorm';
import { EmailAnalysis } from '../entities/email-analysis.entity';
export interface CreateEmailAnalysisData {
    userId: string;
    emailContent: string;
    emailSubject?: string;
    emailSender?: string;
    analysisResult: any;
    riskScore: number;
    isScam: boolean;
}
export declare class EmailAnalysisService {
    private emailAnalysisRepository;
    constructor(emailAnalysisRepository: Repository<EmailAnalysis>);
    createAnalysis(data: CreateEmailAnalysisData): Promise<EmailAnalysis>;
    getAnalysesByUserId(userId: string): Promise<EmailAnalysis[]>;
    getAnalysisById(id: string): Promise<EmailAnalysis | null>;
    getRecentAnalyses(limit?: number): Promise<EmailAnalysis[]>;
    getScamAnalyses(userId?: string): Promise<EmailAnalysis[]>;
    getAnalysisStats(userId?: string): Promise<any>;
}
