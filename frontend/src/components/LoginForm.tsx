import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setLocalLoading(true);
    clearError();

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLocalLoading(false);
    }
  };

  const isSubmitDisabled = !email || !password || localLoading || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          required
          disabled={localLoading || isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
          required
          disabled={localLoading || isLoading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isSubmitDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {localLoading || isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 text-sm"
          disabled={localLoading || isLoading}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
