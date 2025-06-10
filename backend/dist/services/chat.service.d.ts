import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { ChatMessage, MessageRole } from '../entities/chat-message.entity';
export interface CreateChatSessionData {
    userId: string;
    title?: string;
}
export interface CreateChatMessageData {
    sessionId: string;
    role: MessageRole;
    content: string;
}
export declare class ChatService {
    private chatSessionRepository;
    private chatMessageRepository;
    constructor(chatSessionRepository: Repository<ChatSession>, chatMessageRepository: Repository<ChatMessage>);
    createSession(data: CreateChatSessionData): Promise<ChatSession>;
    getSessionsByUserId(userId: string): Promise<ChatSession[]>;
    getSessionWithMessages(sessionId: string): Promise<ChatSession | null>;
    addMessage(data: CreateChatMessageData): Promise<ChatMessage>;
    updateSessionTitle(sessionId: string, title: string): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
    getRecentSessions(limit?: number): Promise<ChatSession[]>;
}
