import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createSession(data: CreateChatSessionData): Promise<ChatSession> {
    const session = this.chatSessionRepository.create(data);
    return await this.chatSessionRepository.save(session);
  }

  async getSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return await this.chatSessionRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getSessionWithMessages(sessionId: string): Promise<ChatSession | null> {
    return await this.chatSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } },
    });
  }

  async addMessage(data: CreateChatMessageData): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create(data);
    const savedMessage = await this.chatMessageRepository.save(message);

    // Update session's updatedAt timestamp
    await this.chatSessionRepository.update(data.sessionId, {
      updatedAt: new Date(),
    });

    return savedMessage;
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    await this.chatSessionRepository.update(sessionId, { title });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.chatSessionRepository.delete(sessionId);
  }

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  async getRecentSessions(limit: number = 10): Promise<ChatSession[]> {
    return await this.chatSessionRepository.find({
      order: { updatedAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}
