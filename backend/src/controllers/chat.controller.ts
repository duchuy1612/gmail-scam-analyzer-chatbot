import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ChatMessageDto, ChatResponseDto } from '../dto/chat.dto';
import { AiService } from '../services/ai.service';
import { ChatService } from '../services/chat.service';
import { MessageRole } from '../entities/chat-message.entity';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly aiService: AiService,
    private readonly chatService: ChatService,
  ) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new chat session',
    description: 'Creates a new chat session for the authenticated user'
  })
  @ApiResponse({
    status: 201,
    description: 'Chat session created successfully'
  })
  async createSession(@Request() req, @Body() body: { title?: string }) {
    return await this.chatService.createSession({
      userId: req.user.id,
      title: body.title || 'New Chat',
    });
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'Get user chat sessions',
    description: 'Retrieves all chat sessions for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Chat sessions retrieved successfully'
  })
  async getSessions(@Request() req) {
    return await this.chatService.getSessionsByUserId(req.user.id);
  }

  @Get('sessions/:id')
  @ApiOperation({
    summary: 'Get chat session with messages',
    description: 'Retrieves a specific chat session with all its messages'
  })
  @ApiResponse({
    status: 200,
    description: 'Chat session retrieved successfully'
  })
  async getSession(@Param('id') sessionId: string) {
    return await this.chatService.getSessionWithMessages(sessionId);
  }

  @Delete('sessions/:id')
  @ApiOperation({
    summary: 'Delete chat session',
    description: 'Deletes a chat session and all its messages'
  })
  @ApiResponse({
    status: 200,
    description: 'Chat session deleted successfully'
  })
  async deleteSession(@Param('id') sessionId: string) {
    await this.chatService.deleteSession(sessionId);
    return { message: 'Session deleted successfully' };
  }
  
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
    // Save user message to database
    await this.chatService.addMessage({
      sessionId: chatMessageDto.sessionId,
      role: MessageRole.USER,
      content: chatMessageDto.message,
    });

    // Get AI response
    const response = await this.aiService.sendChatMessage(
      chatMessageDto.message,
      chatMessageDto.sessionId,
      chatMessageDto.context
    );

    // Save AI response to database
    await this.chatService.addMessage({
      sessionId: chatMessageDto.sessionId,
      role: MessageRole.ASSISTANT,
      content: response.message,
    });

    return response;
  }
}
