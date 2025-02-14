'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Globe from '@/components/threeD/Globe';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [typewriter, setTypewriter] = useState('');
  const router = useRouter();

  useEffect(() => {
    const text = "Connect with HelperBuddy Community";
    let index = 0;
    const typeWriterEffect = setInterval(() => {
      setTypewriter((prev) => prev + text[index]);
      index++;
      if (index === text.length - 1) clearInterval(typeWriterEffect);
    }, 100);
    return () => clearInterval(typeWriterEffect);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fullName = formData.firstName + ' ' + formData.lastName;
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fullName }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('email', formData.email);
        router.push('/verify-otp');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white relative">
      <img src="/grid-pattern.svg" alt="Grid Pattern" className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20 " />
      <div className="w-1/2 h-screen flex flex-col justify-center items-center relative z-10 text-center">
        <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
          <Globe />
        </div>
        <h1 className="text-4xl font-mono text-gradient z-10 mt-16">{typewriter}</h1>
      </div>
      <div className="w-1/2 h-screen flex flex-col justify-center items-center p-8 z-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg bg-gray-800 bg-opacity-30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl space-y-8">
          <h2 className="text-3xl font-bold text-center mb-6">Sign Up for HelperBuddy</h2>
          {error && <p className="text-red-400 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="flex items-center space-x-2 bg-gray-700 bg-opacity-40 p-2 rounded-md">
                  <FaUser className="text-white" />
                  <input type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="bg-transparent focus:outline-none text-white w-full" />
                </label>
              </div>
              <div className="w-1/2">
                <label className="flex items-center space-x-2 bg-gray-700 bg-opacity-40 p-2 rounded-md">
                  <FaUser className="text-white" />
                  <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="bg-transparent focus:outline-none text-white w-full" />
                </label>
              </div>
            </div>
            <label className="flex items-center space-x-2 bg-gray-700 bg-opacity-40 p-2 rounded-md">
              <FaEnvelope className="text-white" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-transparent focus:outline-none text-white w-full" />
            </label>
            <label className="flex items-center space-x-2 bg-gray-700 bg-opacity-40 p-2 rounded-md">
              <FaPhone className="text-white" />
              <input type="tel" placeholder="Mobile Number" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} required className="bg-transparent focus:outline-none text-white w-full" />
            </label>
            <label className="flex items-center space-x-2 bg-gray-700 bg-opacity-40 p-2 rounded-md">
              <FaLock className="text-white" />
              <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="bg-transparent focus:outline-none text-white w-full" />
            </label>
            <div className="relative">
              <button type="submit" className="w-full  text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center relative overflow-hidden">
                {loading ? <Loader2 className="animate-spin absolute inset-0" /> : 'Sign Up'}
                <div className="absolute inset-0 border-2 border-blue-500 rounded-md animate-border-light" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
