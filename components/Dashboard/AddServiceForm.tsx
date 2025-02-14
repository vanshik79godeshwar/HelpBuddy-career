// components/Dashboard/AddServiceForm.tsx
'use client';

import { useState } from 'react';
import axios from '@/lib/axios'; // Import the Axios instance

interface AddServiceFormProps {
  onSuccess: () => void; // Callback for successful submission
}

export default function AddServiceForm({ onSuccess }: AddServiceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    place: '',
    description: '',
    price: 0,
    duration: '',
    images: [] as string[], // Array of Cloudinary URLs
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const uploadedImages: string[] = [];
    setLoading(true);
  
    for (let i = 0; i < files.length && i < 4; i++) {
      const file = files[i];
      if (!file) {
        console.error('File is undefined or null');
        continue;
      }
  
      // Validate file type
      if (![`image/jpeg`, 'image/png', 'image/jpg'].includes(file.type)) {
        console.error('Invalid file type:', file.type);
        setError('Only JPG, JPEG, and PNG files are allowed.');
        setLoading(false);
        return;
      }
  
      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        console.error('File too large:', file.name);
        setError('File size must be less than 5MB.');
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
      // Debugging: Convert FormData to an object for logging
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log('FormData Object:', formDataObject);
  
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
  
        console.log('Cloudinary Response:', response.data);
        uploadedImages.push(response.data.secure_url); // Save Cloudinary URL
      } catch (err: any) {
        console.error('Error uploading image:', err.response?.data || err.message);
        setError('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }
    }
  
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/services/add', formData); // Use Axios instance
      if (response.status === 201) {
        onSuccess(); // Trigger success callback
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Title (e.g., AC Installation)"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Category</option>
        <option value="AC Installation">AC Installation</option>
        <option value="Cleaning">Cleaning</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Electrical">Electrical</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={formData.place}
        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Place</option>
        <option value="Home">Home</option>
        <option value="Office">Office</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        placeholder="Detailed Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      <input
        type="number"
        placeholder="Price (in USD)"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      <input
        type="text"
        placeholder="Duration (e.g., 2 hours)"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      <div>
        <label className="block text-gray-700 font-medium mb-2">Upload Images (Max 4)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <div className="mt-2 flex gap-2">
          {formData.images.map((url, index) => (
            <img key={index} src={url} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-md" />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
      >
        {loading ? 'Adding Service...' : 'Add Service'}
      </button>
    </form>
  );
}