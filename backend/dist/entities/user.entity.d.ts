import { EmailAnalysis } from './email-analysis.entity';
import { ChatSession } from './chat-session.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    emailAnalyses: EmailAnalysis[];
    chatSessions: ChatSession[];
}
export interface CreateUserData {
    email: string;
    name: string;
    password: string;
}
export interface UserResponse {
    id: string;
    email: string;
    name: string;
}
