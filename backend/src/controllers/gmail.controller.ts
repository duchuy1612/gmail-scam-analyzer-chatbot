import { Controller, Post, Body } from '@nestjs/common';
import { GmailService } from '../services/gmail.service';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Post('oauth')
  async handleOAuth(@Body('code') code: string) {
    return await this.gmailService.exchangeCode(code);
  }

  @Post('import')
  async importEmails() {
    return await this.gmailService.importEmails();
  }
}
