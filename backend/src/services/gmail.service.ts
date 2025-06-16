import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GmailMessage } from '../entities/gmail-message.entity';
import { gmailConfig } from '../config/gmail.config';

@Injectable()
export class GmailService {
  constructor(
    @InjectRepository(GmailMessage)
    private gmailRepo: Repository<GmailMessage>,
  ) {}

  private createOAuthClient(accessToken: string) {
    const client = new google.auth.OAuth2(
      gmailConfig.clientId,
      gmailConfig.clientSecret,
      gmailConfig.redirectUri,
    );
    client.setCredentials({ access_token: accessToken });
    return client;
  }

  async importRecentEmails(userId: string, accessToken: string): Promise<GmailMessage[]> {
    const auth = this.createOAuthClient(accessToken);
    const gmail = google.gmail({ version: 'v1', auth });

async importRecentEmails(userId: string, accessToken: string): Promise<GmailMessage[]> {
    const auth = this.createOAuthClient(accessToken);
    const gmail = google.gmail({ version: 'v1', auth });
    const messages: GmailMessage[] = [];

    try {
      const listRes = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

      for (const m of listRes.data.messages || []) {
        try {
          const msgRes = await gmail.users.messages.get({ userId: 'me', id: m.id!, format: 'full' });
          const payload = msgRes.data.payload;
          let subject = '';
          let from = '';
          if (payload?.headers) {
            for (const h of payload.headers) {
              const name = h.name?.toLowerCase();
              if (name === 'subject') subject = h.value || '';
              if (name === 'from') from = h.value || '';
            }
          }
          let body = '';
          if (payload?.parts) {
            const part = payload.parts.find(p => p.mimeType === 'text/plain');
            const data = part?.body?.data;
            if (data) body = Buffer.from(data, 'base64').toString('utf8');
          } else if (payload?.body?.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf8');
          }

          const entity = this.gmailRepo.create({
            userId,
            gmailId: msgRes.data.id!,
            threadId: msgRes.data.threadId!,
            subject,
            sender: from,
            snippet: msgRes.data.snippet || '',
            body,
            importedAt: new Date(),
          });
          const saved = await this.gmailRepo.save(entity);
          messages.push(saved);
        } catch (error) {
          console.error(`Error processing message ${m.id}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching messages: ${error.message}`);
    }

    return messages;
    const messages: GmailMessage[] = [];

    for (const m of listRes.data.messages || []) {
      const msgRes = await gmail.users.messages.get({ userId: 'me', id: m.id!, format: 'full' });
      const payload = msgRes.data.payload;
      let subject = '';
      let from = '';
      if (payload?.headers) {
        for (const h of payload.headers) {
          const name = h.name?.toLowerCase();
          if (name === 'subject') subject = h.value || '';
          if (name === 'from') from = h.value || '';
        }
      }
      let body = '';
      if (payload?.parts) {
}
      let body = '';
      if (payload?.parts) {
        // Use type assertion to ensure 'mimeType' property exists
        const part = payload.parts.find((p): p is { mimeType: string } => 'mimeType' in p && p.mimeType === 'text/plain');
        const data = part?.body?.data;
        if (data) body = Buffer.from(data, 'base64').toString('utf8');
      } else if (payload?.body?.data) {
        const data = part?.body?.data;
        if (data) body = Buffer.from(data, 'base64').toString('utf8');
      } else if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf8');
      }

      const entity = this.gmailRepo.create({
        userId,
        gmailId: msgRes.data.id!,
        threadId: msgRes.data.threadId!,
        subject,
        sender: from,
        snippet: msgRes.data.snippet || '',
        body,
        importedAt: new Date(),
      });
      const saved = await this.gmailRepo.save(entity);
      messages.push(saved);
    }

    return messages;
  }
}
