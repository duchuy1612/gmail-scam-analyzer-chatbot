import Head from 'next/head';
import Chat from '../components/Chat';

export default function ChatPage() {
  return (
    <>
      <Head>
        <title>ScamMail AI - Chat</title>
      </Head>
      <Chat />
    </>
  );
}
