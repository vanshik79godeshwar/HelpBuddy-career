'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { User, Lock, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';  // Importing your configured axios instance

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Using axios instance for POST request
      const { data } = await apiClient.post('/auth/login', { email, password });

      // Store token in cookies
      Cookies.set('token', data.token, { expires: 1, path: '/' });
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response) {
        // Error from server response
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        // Network error or other issue
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-gray-700 rounded-lg 
                       focus:outline-none focus:border-green-500 text-white placeholder-gray-500
                       transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-gray-700 rounded-lg 
                       focus:outline-none focus:border-green-500 text-white placeholder-gray-500
                       transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg
                 font-medium hover:from-green-500 hover:to-green-700 transition-all duration-300
                 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Logging in...
          </>
        ) : (
          'Log In'
        )}
      </button>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      <div className="text-center">
        <a 
          href="#" 
          className="text-sm text-gray-400 hover:text-green-400 transition-colors"
        >
          Forgot password?
        </a>
      </div>
    </motion.form>
  );
}
