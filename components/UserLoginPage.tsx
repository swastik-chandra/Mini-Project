

import React, { useState } from 'react';
import { AtSymbolIcon, LockClosedIcon, SparklesIcon, ArrowLeftIcon } from './Icons';
import type { User } from '../types';

interface UserLoginPageProps {
  reason?: string | null;
  onLoginSuccess: (email: string) => boolean;
  onNavigateToSignup: () => void;
  onNavigateToAdminLogin: () => void;
  onNavigateToDiscover: () => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({ reason, onLoginSuccess, onNavigateToSignup, onNavigateToAdminLogin, onNavigateToDiscover }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication logic
    if (password === 'password') { // Simplified check
        const success = onLoginSuccess(email);
        if (!success) {
            setError('User not found. Please check your email or sign up.');
        }
    } else {
      setError('Invalid password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative animate-fade-in">
      <button 
        onClick={onNavigateToDiscover} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Events</span>
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
            <p className="text-gray-500 dark:text-gray-400">{reason || 'Sign in to manage your events.'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="password"
                />
              </div>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-purple-500 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button onClick={onNavigateToSignup} className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
              Sign up
            </button>
          </p>
        </div>
        <div className="text-center mt-4">
            <button onClick={onNavigateToAdminLogin} className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                Admin Login
            </button>
        </div>
      </div>
    </div>
  );
};