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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_session_entity_1 = require("../entities/chat-session.entity");
const chat_message_entity_1 = require("../entities/chat-message.entity");
let ChatService = class ChatService {
    constructor(chatSessionRepository, chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }
    async createSession(data) {
        const session = this.chatSessionRepository.create(data);
        return await this.chatSessionRepository.save(session);
    }
    async getSessionsByUserId(userId) {
        return await this.chatSessionRepository.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
        });
    }
    async getSessionWithMessages(sessionId) {
        return await this.chatSessionRepository.findOne({
            where: { id: sessionId },
            relations: ['messages'],
            order: { messages: { createdAt: 'ASC' } },
        });
    }
    async addMessage(data) {
        const message = this.chatMessageRepository.create(data);
        const savedMessage = await this.chatMessageRepository.save(message);
        await this.chatSessionRepository.update(data.sessionId, {
            updatedAt: new Date(),
        });
        return savedMessage;
    }
    async updateSessionTitle(sessionId, title) {
        await this.chatSessionRepository.update(sessionId, { title });
    }
    async deleteSession(sessionId) {
        await this.chatSessionRepository.delete(sessionId);
    }
    async getMessagesBySessionId(sessionId) {
        return await this.chatMessageRepository.find({
            where: { sessionId },
            order: { createdAt: 'ASC' },
        });
    }
    async getRecentSessions(limit = 10) {
        return await this.chatSessionRepository.find({
            order: { updatedAt: 'DESC' },
            take: limit,
            relations: ['user'],
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_session_entity_1.ChatSession)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map