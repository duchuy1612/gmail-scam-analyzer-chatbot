"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const email_analysis_dto_1 = require("../dto/email-analysis.dto");
const ai_service_1 = require("../services/ai.service");
const email_analysis_service_1 = require("../services/email-analysis.service");
const auth_guard_1 = require("../guards/auth.guard");
let EmailController = class EmailController {
    constructor(aiService, emailAnalysisService) {
        this.aiService = aiService;
        this.emailAnalysisService = emailAnalysisService;
    }
    async analyzeEmail(analyzeEmailDto, req) {
        const analysisResult = await this.aiService.analyzeEmail(analyzeEmailDto);
        await this.emailAnalysisService.createAnalysis({
            userId: req.user.id,
            emailContent: analyzeEmailDto.body,
            emailSubject: analyzeEmailDto.subject,
            emailSender: analyzeEmailDto.sender,
            analysisResult: analysisResult,
            riskScore: analysisResult.scamProbability,
            isScam: analysisResult.scamProbability > 0.5,
        });
        return analysisResult;
    }
    async getAnalysisHistory(req) {
        return await this.emailAnalysisService.getAnalysesByUserId(req.user.id);
    }
    async getAnalysisStats(req) {
        return await this.emailAnalysisService.getAnalysisStats(req.user.id);
    }
    async getAnalysis(id) {
        return await this.emailAnalysisService.getAnalysisById(id);
    }
    async bulkAnalyzeEmails(emails, req) {
        const results = await this.aiService.bulkAnalyzeEmails(emails);
        const promises = results.map((result, index) => this.emailAnalysisService.createAnalysis({
            userId: req.user.id,
            emailContent: emails[index].body,
            emailSubject: emails[index].subject,
            emailSender: emails[index].sender,
            analysisResult: result,
            riskScore: result.scamProbability,
            isScam: result.scamProbability > 0.5,
        }));
        await Promise.all(promises);
        return results;
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze email for scam indicators',
        description: 'Analyzes an email using AI to detect potential scam characteristics and provides a risk assessment'
    }),
    (0, swagger_1.ApiBody)({
        type: email_analysis_dto_1.AnalyzeEmailDto,
        description: 'Email content and metadata to analyze'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email analysis completed successfully',
        type: email_analysis_dto_1.EmailAnalysisResultDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid email data provided',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Invalid email format' },
                error: { type: 'string', example: 'Bad Request' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during analysis',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Analysis service unavailable' },
                error: { type: 'string', example: 'Internal Server Error' },
                statusCode: { type: 'number', example: 500 }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_analysis_dto_1.AnalyzeEmailDto, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "analyzeEmail", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get email analysis history',
        description: 'Retrieves the email analysis history for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Analysis history retrieved successfully'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getAnalysisHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get email analysis statistics',
        description: 'Retrieves analysis statistics for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getAnalysisStats", null);
__decorate([
    (0, common_1.Get)('analysis/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get specific email analysis',
        description: 'Retrieves a specific email analysis by ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Analysis retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getAnalysis", null);
__decorate([
    (0, common_1.Post)('bulk-analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze multiple emails at once',
        description: 'Performs batch analysis of multiple emails for scam detection'
    }),
    (0, swagger_1.ApiBody)({
        type: [email_analysis_dto_1.AnalyzeEmailDto],
        description: 'Array of emails to analyze'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk analysis completed successfully',
        type: [email_analysis_dto_1.EmailAnalysisResultDto]
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid email data in request'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "bulkAnalyzeEmails", null);
exports.EmailController = EmailController = __decorate([
    (0, swagger_1.ApiTags)('emails'),
    (0, common_1.Controller)('emails'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        email_analysis_service_1.EmailAnalysisService])
], EmailController);
//# sourceMappingURL=email.controller.js.map