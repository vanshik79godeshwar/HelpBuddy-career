'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { X, Upload } from 'lucide-react'; // Removed Plus since it's unused

interface AddServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ISubService {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface ImageUploadResponse {
  secure_url: string;
}

export default function AddServiceForm({ onSuccess, onCancel }: AddServiceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subServiceId: '',
    place: '',
    description: '',
    duration: '',
    images: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [subServices, setSubServices] = useState<ISubService[]>([]);
  const [selectedSubService, setSelectedSubService] = useState<ISubService | null>(null);

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const response = await axios.get<{ subServices: ISubService[] }>('/services/subservices');
        setSubServices(response.data.subServices);
      } catch (err: unknown) {
        console.error('Error fetching subServices:', err);
        setError('Failed to fetch services. Please try again.');
      }
    };

    fetchSubServices();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedImages: string[] = [];
    setLoading(true);

    for (let i = 0; i < files.length && i < 4; i++) {
      const file = files[i];

      if (!file) continue;

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Only JPG, JPEG, and PNG files are allowed.');
        setLoading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      try {
        const response = await axios.post<ImageUploadResponse>(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        uploadedImages.push(response.data.secure_url);
      } catch (err: unknown) {
        console.error('Error uploading image:', err);
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

    if (!selectedSubService) {
      setError('Please select a service.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/services/add', {
        ...formData,
        title: selectedSubService.name,
        category: selectedSubService.category,
        price: selectedSubService.price,
      });

      if (response.status === 201) {
        onSuccess();
      } else {
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <select
            value={formData.subServiceId}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedService = subServices.find((service) => service._id === selectedId);
              setSelectedSubService(selectedService || null);
              setFormData((prev) => ({ ...prev, subServiceId: selectedId }));
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Service</option>
            {subServices.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price} - {service.category}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Place"
            value={formData.place}
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Detailed Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <label className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center cursor-pointer">
              <Upload className="w-10 h-10 text-gray-500" />
              <p className="text-gray-500 text-sm">Drag & Drop or click to upload</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
            <div className="mt-2 flex gap-2">
              {formData.images.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-md" />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
          >
            {loading ? 'Adding Service...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
}
