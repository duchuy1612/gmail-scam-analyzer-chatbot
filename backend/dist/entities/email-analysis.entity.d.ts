import { User } from './user.entity';
export declare class EmailAnalysis {
    id: string;
    userId: string;
    emailContent: string;
    emailSubject: string;
    emailSender: string;
    analysisResult: any;
    riskScore: number;
    isScam: boolean;
    analyzedAt: Date;
    user: User;
}
