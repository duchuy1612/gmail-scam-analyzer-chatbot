import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiClient } from '../lib/api';

export default function ConnectGmail() {
  const router = useRouter();

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiClient } from '../lib/api';

// Function to generate OAuth URL
const generateOAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirect_uri: `${window.location.origin}/connect-gmail`,
    response_type: 'code',
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export default function ConnectGmail() {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (typeof code === 'string') {
      const handleGmailCode = async () => {
try {
          await apiClient.exchangeGmailCode(code);
          await apiClient.importGmailEmails();
        } catch (error) {
          console.error('Error connecting to Gmail:', error);
          // TODO: Implement error handling UI
        } finally {
          router.replace('/dashboard');
        }
          await apiClient.exchangeGmailCode(code);
          await apiClient.importGmailEmails();
        } finally {
          router.replace('/dashboard');
        }
      };

      handleGmailCode();
    } else if (typeof window !== 'undefined') {
      window.location.href = generateOAuthUrl();
    }
  }, [router]);

  return <p className="p-4">Connecting to Gmail...</p>;
}
    const { code } = router.query;

    if (typeof code === 'string') {
      const handleGmailCode = async () => {
        try {
          await apiClient.exchangeGmailCode(code);
          await apiClient.importGmailEmails();
          router.replace('/dashboard');
        } catch (err) {
          console.error('Gmail connection failed', err);
          // TODO: surface a toast / error state instead of silent redirect
        }
      };

      handleGmailCode();
    } else {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          redirect_uri: `${window.location.origin}/connect-gmail`,
          response_type: 'code',
          access_type: 'offline',
          scope: 'https://www.googleapis.com/auth/gmail.readonly',
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }
    }
  }, [router]);

  return <p className="p-4">Connecting to Gmail...</p>;
}
