import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';
export declare class ChatSession {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    messages: ChatMessage[];
}
