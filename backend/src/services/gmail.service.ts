import { Injectable } from '@nestjs/common';
import { google, gmail_v1 } from 'googleapis';

@Injectable()
export class GmailService {
  private oauth2Client: any;

  constructor() {
    const clientId = process.env.GMAIL_CLIENT_ID || '';
    const clientSecret = process.env.GMAIL_CLIENT_SECRET || '';
    const redirectUri = process.env.GMAIL_REDIRECT_URI || '';
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async importEmails(): Promise<gmail_v1.Schema$ListMessagesResponse> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const res = await gmail.users.messages.list({ userId: 'me', maxResults: 5 });
    return res.data;
  }
}
