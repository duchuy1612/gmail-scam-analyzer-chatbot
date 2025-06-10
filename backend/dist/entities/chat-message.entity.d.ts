import { ChatSession } from './chat-session.entity';
export declare enum MessageRole {
    USER = "user",
    ASSISTANT = "assistant"
}
export declare class ChatMessage {
    id: string;
    sessionId: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
    session: ChatSession;
}
