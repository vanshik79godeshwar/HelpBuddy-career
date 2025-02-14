// components/Dashboard/AddServiceButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function AddServiceButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/services/add')}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
    >
      Add New Service
    </button>
  );
}