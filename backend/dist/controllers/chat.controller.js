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
const chat_service_1 = require("../services/chat.service");
const chat_message_entity_1 = require("../entities/chat-message.entity");
const auth_guard_1 = require("../guards/auth.guard");
let ChatController = class ChatController {
    constructor(aiService, chatService) {
        this.aiService = aiService;
        this.chatService = chatService;
    }
    async createSession(req, body) {
        return await this.chatService.createSession({
            userId: req.user.id,
            title: body.title || 'New Chat',
        });
    }
    async getSessions(req) {
        return await this.chatService.getSessionsByUserId(req.user.id);
    }
    async getSession(sessionId) {
        return await this.chatService.getSessionWithMessages(sessionId);
    }
    async deleteSession(sessionId) {
        await this.chatService.deleteSession(sessionId);
        return { message: 'Session deleted successfully' };
    }
    async sendMessage(chatMessageDto) {
        await this.chatService.addMessage({
            sessionId: chatMessageDto.sessionId,
            role: chat_message_entity_1.MessageRole.USER,
            content: chatMessageDto.message,
        });
        const response = await this.aiService.sendChatMessage(chatMessageDto.message, chatMessageDto.sessionId, chatMessageDto.context);
        await this.chatService.addMessage({
            sessionId: chatMessageDto.sessionId,
            role: chat_message_entity_1.MessageRole.ASSISTANT,
            content: response.message,
        });
        return response;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new chat session',
        description: 'Creates a new chat session for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat session created successfully'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user chat sessions',
        description: 'Retrieves all chat sessions for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat sessions retrieved successfully'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chat session with messages',
        description: 'Retrieves a specific chat session with all its messages'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat session retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete chat session',
        description: 'Deletes a chat session and all its messages'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat session deleted successfully'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteSession", null);
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map