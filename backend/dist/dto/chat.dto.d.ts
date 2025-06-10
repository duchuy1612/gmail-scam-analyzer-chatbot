export declare class ChatMessageDto {
    message: string;
    sessionId?: string;
    context?: string[];
}
export declare class ChatResponseDto {
    response: string;
    sessionId: string;
    suggestions: string[];
    timestamp: string;
}
