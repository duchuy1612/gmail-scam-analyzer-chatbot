import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, error, clearError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError('All fields are required');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    clearError();

    try {
      await register(formData.email, formData.password, formData.name);
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLocalLoading(false);
    }
  };

  const isSubmitDisabled = localLoading || isLoading;
  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your full name"
          required
          disabled={isSubmitDisabled}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          required
          disabled={isSubmitDisabled}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password (minimum 6 characters)"
          required
          disabled={isSubmitDisabled}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Confirm your password"
          required
          disabled={isSubmitDisabled}
        />
      </div>

      {displayError && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {displayError}
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
        {localLoading || isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 text-sm"
          disabled={isSubmitDisabled}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
