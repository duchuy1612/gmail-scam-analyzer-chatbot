import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiClient } from '../lib/api';

export default function ConnectGmail() {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (typeof code === 'string') {
      const handleGmailCode = async () => {
        try {
          await apiClient.exchangeGmailCode(code);
          await apiClient.importGmailEmails();
        } finally {
          router.replace('/dashboard');
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
