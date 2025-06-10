import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatMessageDto, ChatResponseDto } from '../dto/chat.dto';
import { AiService } from '../services/ai.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly aiService: AiService) {}
  
  @Post('message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message to AI chat assistant',
    description: 'Interact with the AI chatbot for guidance on email security and scam detection'
  })
  @ApiBody({
    type: ChatMessageDto,
    description: 'User message and chat context'
  })
  @ApiResponse({
    status: 200,
    description: 'Chat response generated successfully',
    type: ChatResponseDto
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async sendMessage(@Body() chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
    return await this.aiService.sendChatMessage(
      chatMessageDto.message,
      chatMessageDto.sessionId,
      chatMessageDto.context
    );
  }
}
