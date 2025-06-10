export declare class AnalyzeEmailDto {
    subject: string;
    body: string;
    sender: string;
    recipient: string;
    headers?: string[];
    urls?: string[];
}
export declare class EmailAnalysisResultDto {
    scamProbability: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    explanation: string;
    redFlags: string[];
    confidence: number;
    analyzedAt: string;
    analysisId: string;
}
