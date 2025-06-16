export const gmailConfig = {
export const gmailConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || throw new Error('GOOGLE_CLIENT_ID is not set'),
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || throw new Error('GOOGLE_CLIENT_SECRET is not set'),
  redirectUri: process.env.GOOGLE_REDIRECT_URI || throw new Error('GOOGLE_REDIRECT_URI is not set'),
};
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
};
