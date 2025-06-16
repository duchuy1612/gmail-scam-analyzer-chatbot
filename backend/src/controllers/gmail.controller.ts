import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GmailService } from '../services/gmail.service';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('gmail')
@Controller('gmail')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Post('oauth')
  async handleOAuth(@Body('code') code: string, @Request() req) {
    return await this.gmailService.exchangeCode(req.user.id, code);
  }

  @Post('import')
  async importEmails(@Request() req) {
    return await this.gmailService.importEmails(req.user.id);
  }
}
