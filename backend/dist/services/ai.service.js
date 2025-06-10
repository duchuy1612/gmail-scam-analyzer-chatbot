"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    constructor() {
        this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    }
    async analyzeEmail(emailData) {
        try {
            const response = await fetch(`${this.aiServiceUrl}/analyze-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });
            if (!response.ok) {
                throw new common_1.HttpException('AI service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            const result = await response.json();
            return {
                scamProbability: result.scam_probability || result.scamProbability,
                riskLevel: result.risk_level || result.riskLevel,
                explanation: result.explanation,
                redFlags: result.red_flags || result.redFlags || [],
                confidence: result.confidence,
                analyzedAt: new Date().toISOString(),
                analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('AI Service Error:', error);
            throw new common_1.HttpException('Failed to analyze email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkAnalyzeEmails(emails) {
        try {
            const response = await fetch(`${this.aiServiceUrl}/bulk-analyze-emails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails }),
            });
            if (!response.ok) {
                throw new common_1.HttpException('AI service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            const results = await response.json();
            return results.map((result, index) => ({
                scamProbability: result.scam_probability || result.scamProbability,
                riskLevel: result.risk_level || result.riskLevel,
                explanation: result.explanation,
                redFlags: result.red_flags || result.redFlags || [],
                confidence: result.confidence,
                analyzedAt: new Date().toISOString(),
                analysisId: `analysis_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            }));
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('AI Service Error:', error);
            throw new common_1.HttpException('Failed to analyze emails', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendChatMessage(message, sessionId, context) {
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
                throw new common_1.HttpException('AI chat service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            const result = await response.json();
            return {
                response: result.response,
                sessionId: result.session_id || sessionId || `session_${Date.now()}`,
                suggestions: result.suggestions || [],
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('AI Chat Service Error:', error);
            throw new common_1.HttpException('Failed to process chat message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async healthCheck() {
        try {
            const response = await fetch(`${this.aiServiceUrl}/health`, {
                method: 'GET',
            });
            if (!response.ok) {
                return { status: 'unhealthy', message: 'AI service not responding' };
            }
            return await response.json();
        }
        catch (error) {
            return { status: 'unhealthy', message: 'AI service connection failed' };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map