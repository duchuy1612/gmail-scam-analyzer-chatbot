import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Redirect to dashboard or home page after successful authentication
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{isLoginMode ? 'Sign In' : 'Sign Up'} - ScamMail AI</title>
        <meta name="description" content="Sign in to your ScamMail AI account" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ScamMail AI</h1>
            <h2 className="text-xl font-semibold text-gray-700">
              {isLoginMode ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLoginMode 
                ? 'Sign in to access your email security dashboard' 
                : 'Join us to protect yourself from email scams'
              }
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            {isLoginMode ? (
              <LoginForm onToggleMode={toggleMode} isLoading={isLoading} />
            ) : (
              <RegisterForm onToggleMode={toggleMode} isLoading={isLoading} />
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>AI-powered email security platform</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
