import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Github, Mail, Lock } from 'lucide-react';
import { mockAuth } from '../../lib/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'github' | 'credentials'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginMethod === 'credentials') {
      if (email === 'demo@example.com' && password === 'password') {
        mockAuth.login(() => navigate('/dashboard'));
      } else {
        setError('Invalid credentials');
      }
    } else {
      mockAuth.login(() => navigate('/dashboard'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setLoginMethod('credentials')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                loginMethod === 'credentials'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setLoginMethod('github')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                loginMethod === 'github'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {loginMethod === 'credentials' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                    Forgot your password?
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click the button below to continue with GitHub
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loginMethod === 'credentials' ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign in
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}