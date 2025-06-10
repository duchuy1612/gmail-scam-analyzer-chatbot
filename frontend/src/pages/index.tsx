import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>ScamMail AI</title>
      </Head>
      <main style={{ padding: '1rem' }}>
        <h1 className="text-2xl font-bold">ScamMail AI</h1>
        <p className="mt-2">Front page placeholder.</p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/chat" legacyBehavior>
            <a className="btn btn-primary" style={{ marginRight: '0.5rem' }}>Open Chat</a>
          </Link>
          <Link href="/dashboard" legacyBehavior>
            <a className="btn btn-secondary">Dashboard</a>
          </Link>
        </div>
      </main>
    </>
  );
}
