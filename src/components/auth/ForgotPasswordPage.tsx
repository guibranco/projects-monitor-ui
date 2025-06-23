import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // In a real application, this would call an API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center">
            <Activity className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to {email}
            </p>
          </div>
          <div className="mt-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send reset link
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}