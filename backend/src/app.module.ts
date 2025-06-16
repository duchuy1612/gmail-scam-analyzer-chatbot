import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './controllers/email.controller';
import { ChatController } from './controllers/chat.controller';
import { AuthController } from './controllers/auth.controller';
import { GmailController } from './controllers/gmail.controller';
import { AiService } from './services/ai.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { EmailAnalysisService } from './services/email-analysis.service';
import { ChatService } from './services/chat.service';
import { GmailService } from './services/gmail.service';
import { databaseConfig } from './config/database.config';
import { User } from './entities/user.entity';
import { EmailAnalysis } from './entities/email-analysis.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { GmailMessage } from './entities/gmail-message.entity';
import { GmailService } from './services/gmail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, EmailAnalysis, ChatSession, ChatMessage, RefreshToken, GmailMessage]),
  ],
  controllers: [
    AppController,
    EmailController,
    ChatController,
    AuthController,
    GmailController
  ],
  providers: [
    AppService,
    AiService,
    AuthService,
    UserService,
    EmailAnalysisService,
    ChatService,
    GmailService
  ],
})
export class AppModule {}
