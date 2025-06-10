import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: 'The user message content',
    example: 'Can you analyze this email I received about winning a lottery?'
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Chat session ID for conversation continuity',
    example: 'session_abc123def456',
    required: false
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'Context from previous messages',
    example: ['Previous analysis showed high scam probability', 'User asked about phishing techniques'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context?: string[];
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'AI assistant response',
    example: 'I can help you analyze that email. Please share the email content, subject line, and sender information.'
  })
  response: string;

  @ApiProperty({
    description: 'Chat session ID',
    example: 'session_abc123def456'
  })
  sessionId: string;

  @ApiProperty({
    description: 'Suggested follow-up actions',
    example: ['Share email content', 'Check sender reputation', 'Verify with official source']
  })
  suggestions: string[];

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-06-10T14:30:00Z'
  })
  timestamp: string;
}
