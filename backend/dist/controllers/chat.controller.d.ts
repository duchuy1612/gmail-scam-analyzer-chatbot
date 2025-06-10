import { ChatMessageDto, ChatResponseDto } from '../dto/chat.dto';
import { AiService } from '../services/ai.service';
export declare class ChatController {
    private readonly aiService;
    constructor(aiService: AiService);
    sendMessage(chatMessageDto: ChatMessageDto): Promise<ChatResponseDto>;
}
