import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './controllers/email.controller';
import { ChatController } from './controllers/chat.controller';
import { AuthController } from './controllers/auth.controller';
import { AiService } from './services/ai.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    EmailController,
    ChatController,
    AuthController
  ],
  providers: [AppService, AiService, AuthService],
})
export class AppModule {}
