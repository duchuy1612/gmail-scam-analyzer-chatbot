import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GmailToken } from '../entities/gmail-token.entity';

@Injectable()
export class GmailService {
  private createClient(): OAuth2Client {
    return new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI,
    );
  }

  constructor(
    @InjectRepository(GmailToken)
    private gmailTokenRepo: Repository<GmailToken>,
  ) {}

  async getOAuthClient(userId: string): Promise<OAuth2Client> {
    const client = this.createClient();
    const token = await this.gmailTokenRepo.findOne({ where: { userId } });
    if (token) {
      client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expiry_date: token.expiryDate,
      });
    }
    return client;
  }

  async saveTokens(userId: string, tokens: Auth.Credentials): Promise<void> {
    let record = await this.gmailTokenRepo.findOne({ where: { userId } });
    const expiryDate = tokens.expiry_date ?? 0;
    if (!record) {
      record = this.gmailTokenRepo.create({
        userId,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate,
      });
    } else {
      record.accessToken = tokens.access_token!;
      record.refreshToken = tokens.refresh_token!;
      record.expiryDate = expiryDate;
    }
    await this.gmailTokenRepo.save(record);
  }

  async handleOAuthCallback(userId: string, code: string): Promise<Auth.Credentials> {
    const client = this.createClient();
    const { tokens } = await client.getToken(code);
    await this.saveTokens(userId, tokens);
    return tokens;
  }
}
