// app/dashboard/profile/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios'; // Ensure you have an Axios instance configured

interface IWorker {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  isApproved: boolean;
  image: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<IWorker>({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    otp: '',
    otpExpires: new Date(),
    isVerified: false,
    isApproved: false,
    image: '/images/default-avatar.png',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const workerId = localStorage.getItem('WorkerID');
        if (!workerId) {
          setError('Worker ID not found in local storage.');
          return;
        }

        const response = await axios.get(`/worker/worker?workerId=${workerId}`);
        setFormData(response.data);
      } catch (err: any) {
        console.error('Error fetching worker data:', err.response?.data || err.message);
        setError('Failed to fetch worker data. Please try again.');
      }
    };

    fetchWorkerData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let updatedImage = formData.image;

    if (file) {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append('file', file);
      formDataCloudinary.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formDataCloudinary
        );

        updatedImage = response.data.secure_url; // Save Cloudinary URL
      } catch (err: any) {
        console.error('Error uploading image:', err.response?.data || err.message);
        setError('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }
    }

    try {
      const workerId = localStorage.getItem('workerId');
      if (!workerId) {
        setError('Worker ID not found in local storage.');
        setLoading(false);
        return;
      }

      const response = await axios.put(`/api/worker/update/${workerId}`, {
        ...formData,
        image: updatedImage,
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mobileNumber"
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
            Profile Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
        >
          {loading ? 'Updating Profile...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}