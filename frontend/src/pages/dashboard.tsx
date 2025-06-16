import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, HealthCheckResponse } from '../lib/api';
import { useApi } from '../hooks/useApi';
import Card from '../components/Card';
import AlertBanner from '../components/AlertBanner';
import EmailAnalyzer from '../components/EmailAnalyzer';
import Chat from '../components/Chat';
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'analyzer' | 'health'>('chat');
  const { data: healthData, loading: healthLoading, execute: checkHealth } = useApi<HealthCheckResponse>();
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'health') {
      checkHealth(() => apiClient.healthCheck());
    }
  }, [activeTab, checkHealth]);

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - ScamMail AI</title>
        <meta name="description" content="Email security dashboard" />
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Analyze emails and chat with our AI assistant for email security guidance.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/connect-gmail')}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Connect Gmail
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                AI Chat Assistant
              </button>
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'analyzer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Email Analyzer
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'health'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                System Health
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'chat' && <Chat />}
            
            {activeTab === 'analyzer' && <EmailAnalyzer />}
            
            {activeTab === 'health' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health Status</h2>
                
                {healthLoading && (
                  <AlertBanner type="info">
                    Checking system health...
                  </AlertBanner>
                )}
                
                {healthData && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card title="Backend API">
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                          healthData.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-semibold">
                          {healthData.status === 'healthy' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div><strong>Uptime:</strong> {Math.round(healthData.uptime)}s</div>
                        <div><strong>Last Check:</strong> {new Date(healthData.timestamp).toLocaleString()}</div>
                      </div>
                    </Card>

                    <Card title="Services">
                      <div className="space-y-2">
                        {healthData.services && Object.entries(healthData.services).map(([service, status]) => (
                          <div key={service} className="flex justify-between">
                            <span className="text-sm">{service.replace('_', ' ').toUpperCase()}:</span>
                            <span className={`text-sm font-semibold ${
                              status === 'healthy' || status === 'connected' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {typeof status === 'string' ? status : 'Unknown'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card title="API Endpoints">
                      <div className="space-y-3">
                        <a 
                          href="http://localhost:3001/api/docs" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                          📖 View Swagger Documentation
                        </a>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Backend: http://localhost:3001</div>
                          <div>AI Service: http://localhost:8000</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
