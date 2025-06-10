import Head from 'next/head';
import Chat from '../components/Chat';
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>AI Chat - ScamMail AI</title>
        <meta name="description" content="Chat with our AI assistant about email security" />
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
            <p className="mt-2 text-gray-600">Ask questions about email security and get expert guidance.</p>
          </div>
          <Chat />
        </div>
      </div>
    </ProtectedRoute>
  );
}
