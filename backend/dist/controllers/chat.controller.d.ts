import { ChatMessageDto, ChatResponseDto } from '../dto/chat.dto';
import { AiService } from '../services/ai.service';
import { ChatService } from '../services/chat.service';
export declare class ChatController {
    private readonly aiService;
    private readonly chatService;
    constructor(aiService: AiService, chatService: ChatService);
    createSession(req: any, body: {
        title?: string;
    }): Promise<import("../entities/chat-session.entity").ChatSession>;
    getSessions(req: any): Promise<import("../entities/chat-session.entity").ChatSession[]>;
    getSession(sessionId: string): Promise<import("../entities/chat-session.entity").ChatSession>;
    deleteSession(sessionId: string): Promise<{
        message: string;
    }>;
    sendMessage(chatMessageDto: ChatMessageDto): Promise<ChatResponseDto>;
}
