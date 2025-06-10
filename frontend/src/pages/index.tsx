import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>ScamMail AI - AI-Powered Email Security</title>
        <meta name="description" content="Protect yourself from email scams with AI-powered analysis" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">AI-Powered</span>
              <span className="block text-blue-600">Email Security</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Protect yourself from email scams and phishing attempts with our advanced AI detection system.
            </p>
            
            <div className="mt-10 flex justify-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
                    Go to Dashboard
                  </Link>
                  <Link href="/chat" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors">
                    Open Chat
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
                    Get Started
                  </Link>
                  <Link href="/auth" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Detection</h3>
                <p className="text-gray-600">Advanced machine learning algorithms analyze email content for scam patterns.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
                <p className="text-gray-600">Get instant results and risk assessments for your emails.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Assistant</h3>
                <p className="text-gray-600">Ask questions about email security and get expert guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
