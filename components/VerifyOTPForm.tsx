// components/VerifyOTPForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function VerifyOTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('email'), otp: otp.join('') }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token in cookies
        Cookies.set('token', data.token, { expires: 1 }); // Expires in 1 day

        setSuccess(true);
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Error : ',  err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Verify Your Email</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">OTP verified successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              autofiller="off"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-lg font-bold"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}