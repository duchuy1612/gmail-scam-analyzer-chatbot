import { Injectable } from '@nestjs/common';
import { google, gmail_v1, Auth } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GmailToken } from '../entities/gmail-token.entity';
import { GmailMessage } from '../entities/gmail-message.entity';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class GmailService {
  constructor(
    @InjectRepository(GmailToken)
    private readonly gmailTokenRepo: Repository<GmailToken>,
    @InjectRepository(GmailMessage)
    private readonly gmailMessageRepo: Repository<GmailMessage>,
  ) {}

  private createClient(): OAuth2Client {
    return new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI,
    );
  }

  async getOAuthClient(userId: string): Promise<OAuth2Client> {
    const client = this.createClient();
    if (validator.isUUID(userId)) {
      const token = await this.gmailTokenRepo.findOne({ where: { userId } });
      if (token) {
        client.setCredentials({
          access_token: token.accessToken,
          refresh_token: token.refreshToken,
          expiry_date: token.expiryDate,
        });
      }
    }
    return client;
  }

  async saveTokens(userId: string, tokens: Auth.Credentials): Promise<void> {
    const sanitizedUserId = sanitizeHtml(userId);
    let record = await this.gmailTokenRepo.findOne({ where: { userId: sanitizedUserId } });
    const expiryDate = tokens.expiry_date ?? 0;

    if (!record) {
      record = this.gmailTokenRepo.create({
        userId: sanitizedUserId,
        accessToken: tokens.access_token ?? '',
        refreshToken: tokens.refresh_token ?? '',
        expiryDate,
      });
    } else {
      record.accessToken = tokens.access_token ?? record.accessToken;
      record.refreshToken = tokens.refresh_token ?? record.refreshToken;
      record.expiryDate = expiryDate;
    }

    await this.gmailTokenRepo.save(record);
  }

  async exchangeCode(userId: string, code: string): Promise<Auth.Credentials> {
    const client = this.createClient();
    const { tokens } = await client.getToken(code);
    await this.saveTokens(userId, tokens);
    return tokens;
  }

  private decodeBody(part?: gmail_v1.Schema$MessagePart): string {
    if (!part) return '';
    if (part.body?.data) {
      const data = part.body.data.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(data, 'base64').toString('utf8');
    }
    if (part.parts) {
      for (const p of part.parts) {
        const res = this.decodeBody(p);
        if (res) return res;
      }
    }
    return '';
  }

  async importEmails(userId: string): Promise<GmailMessage[]> {
    const client = await this.getOAuthClient(userId);
    const gmail = google.gmail({ version: 'v1', auth: client });
    const list = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
    const messages = list.data.messages ?? [];
    const results: GmailMessage[] = [];

    for (const m of messages) {
      if (!m.id) continue;
      const full = await gmail.users.messages.get({ userId: 'me', id: m.id, format: 'full' });
      const payload = full.data.payload;
      const headers = payload?.headers ?? [];
      const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value ?? '';
      const sender = headers.find(h => h.name?.toLowerCase() === 'from')?.value ?? '';
      const snippet = full.data.snippet ?? '';
      const body = this.decodeBody(payload);

      const record = this.gmailMessageRepo.create({
        userId,
        gmailId: full.data.id!,
        threadId: full.data.threadId!,
        subject,
        sender,
        snippet,
        body,
      });
      results.push(await this.gmailMessageRepo.save(record));
    }

    return results;
  }

  async importRecentEmails(userId: string, accessToken: string): Promise<GmailMessage[]> {
    const client = this.createClient();
    client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: client });
    const list = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
    const messages = list.data.messages ?? [];
    const results: GmailMessage[] = [];

    for (const m of messages) {
      if (!m.id) continue;
      const full = await gmail.users.messages.get({ userId: 'me', id: m.id, format: 'full' });
      const payload = full.data.payload;
      const headers = payload?.headers ?? [];
      const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value ?? '';
      const sender = headers.find(h => h.name?.toLowerCase() === 'from')?.value ?? '';
      const snippet = full.data.snippet ?? '';
      const body = this.decodeBody(payload);

      const record = this.gmailMessageRepo.create({
        userId,
        gmailId: full.data.id!,
        threadId: full.data.threadId!,
        subject,
        sender,
        snippet,
        body,
      });
      results.push(await this.gmailMessageRepo.save(record));
    }

    return results;
  }
}
