// app/login/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';
import { CircleDot, Sparkles, Workflow } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left side - Animated Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black/20">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated Background Elements */}
          <div className="relative w-full h-full">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`,
                  scale: 0
                }}
                animate={{ 
                  top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <CircleDot className="text-green-500/20" size={100 + i * 40} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-green-400" />
              <h1 className="text-4xl font-bold">Helper Buddy</h1>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Workflow className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Smart Assistant</h3>
                  <p className="text-gray-400 mt-1">Your AI-powered companion for enhanced productivity</p>
                </div>
              </div>
              
              {/* Add more feature highlights here */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Login to access your dashboard</p>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-400 text-center"
              >
                {message}
              </motion.div>
            )}

            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}