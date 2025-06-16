import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EmailAnalysis } from '../entities/email-analysis.entity';
import { ChatSession } from '../entities/chat-session.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { GmailToken } from '../entities/gmail-token.entity';
import { GmailMessage } from '../entities/gmail-message.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_DATABASE || 'gmail_scam_analyzer',
  entities: [User, EmailAnalysis, ChatSession, ChatMessage, RefreshToken, GmailMessage],
  synchronize: false, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: 3,
  retryDelay: 3000,
};
