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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_dto_1 = require("../dto/chat.dto");
const ai_service_1 = require("../services/ai.service");
let ChatController = class ChatController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async sendMessage(chatMessageDto) {
        return await this.aiService.sendChatMessage(chatMessageDto.message, chatMessageDto.sessionId, chatMessageDto.context);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Send message to AI chat assistant',
        description: 'Interact with the AI chatbot for guidance on email security and scam detection'
    }),
    (0, swagger_1.ApiBody)({
        type: chat_dto_1.ChatMessageDto,
        description: 'User message and chat context'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat response generated successfully',
        type: chat_dto_1.ChatResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid message format',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Message cannot be empty' },
                error: { type: 'string', example: 'Bad Request' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Chat service unavailable',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'AI service temporarily unavailable' },
                error: { type: 'string', example: 'Internal Server Error' },
                statusCode: { type: 'number', example: 500 }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map