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
exports.ChatResponseDto = exports.ChatMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChatMessageDto {
}
exports.ChatMessageDto = ChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The user message content',
        example: 'Can you analyze this email I received about winning a lottery?'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chat session ID for conversation continuity',
        example: 'session_abc123def456',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Context from previous messages',
        example: ['Previous analysis showed high scam probability', 'User asked about phishing techniques'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ChatMessageDto.prototype, "context", void 0);
class ChatResponseDto {
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'AI assistant response',
        example: 'I can help you analyze that email. Please share the email content, subject line, and sender information.'
    }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "response", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chat session ID',
        example: 'session_abc123def456'
    }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Suggested follow-up actions',
        example: ['Share email content', 'Check sender reputation', 'Verify with official source']
    }),
    __metadata("design:type", Array)
], ChatResponseDto.prototype, "suggestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response timestamp',
        example: '2025-06-10T14:30:00Z'
    }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=chat.dto.js.map