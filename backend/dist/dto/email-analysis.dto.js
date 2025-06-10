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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAnalysisResultDto = exports.AnalyzeEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AnalyzeEmailDto {
}
exports.AnalyzeEmailDto = AnalyzeEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email subject line',
        example: 'Urgent: Your account will be suspended'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email body content',
        example: 'Dear valued customer, your account will be suspended unless you verify your information immediately...'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeEmailDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sender email address',
        example: 'noreply@suspicious-bank.com'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AnalyzeEmailDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient email address',
        example: 'user@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AnalyzeEmailDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email headers for additional analysis',
        example: ['Return-Path: <bounce@suspicious-bank.com>', 'X-Originating-IP: [192.168.1.1]'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyzeEmailDto.prototype, "headers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URLs found in the email content',
        example: ['https://suspicious-bank-verify.com/login', 'https://bit.ly/3xyz123'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyzeEmailDto.prototype, "urls", void 0);
class EmailAnalysisResultDto {
}
exports.EmailAnalysisResultDto = EmailAnalysisResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scam probability score (0-1)',
        example: 0.85,
        minimum: 0,
        maximum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], EmailAnalysisResultDto.prototype, "scamProbability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Risk level classification',
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        example: 'HIGH'
    }),
    __metadata("design:type", String)
], EmailAnalysisResultDto.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed explanation of the analysis',
        example: 'This email contains multiple scam indicators including urgency tactics, suspicious links, and sender domain mismatch.'
    }),
    __metadata("design:type", String)
], EmailAnalysisResultDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific red flags identified',
        example: ['Urgent language', 'Suspicious domain', 'Phishing links', 'Grammar errors']
    }),
    __metadata("design:type", Array)
], EmailAnalysisResultDto.prototype, "redFlags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Analysis confidence score (0-1)',
        example: 0.92,
        minimum: 0,
        maximum: 1
    }),
    __metadata("design:type", Number)
], EmailAnalysisResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of analysis',
        example: '2025-06-10T14:30:00Z'
    }),
    __metadata("design:type", String)
], EmailAnalysisResultDto.prototype, "analyzedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique analysis ID for tracking',
        example: 'analysis_abc123def456'
    }),
    __metadata("design:type", String)
], EmailAnalysisResultDto.prototype, "analysisId", void 0);
//# sourceMappingURL=email-analysis.dto.js.map