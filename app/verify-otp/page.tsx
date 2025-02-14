// app/verify-otp/page.tsx
'use client';

import VerifyOTPForm from '@/components/VerifyOTPForm';

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <VerifyOTPForm />
    </div>
  );
}