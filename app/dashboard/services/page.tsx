// app/dashboard/service/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddServiceForm from '@/components/Dashboard/AddServiceForm'; // Import the AddServiceForm component
// import axios from '@/lib/axios';
import { CheckCircle, Clock, Plus } from 'lucide-react';
import axios from 'axios';

interface Service {
  _id: string;
  workerId: string;
  title: string;
  category: string;
  place: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
  
      const response = await axios.get('/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setServices(response.data.services);
    } catch (err: unknown) { 
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to load services');
        console.error('Error fetching services:', err.message);
      } else if (err instanceof Error) {
        setError(err.message);
        console.error('General error:', err.message);
      } else {
        setError('An unexpected error occurred');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddServiceSuccess = () => {
    fetchServices();
    setShowAddForm(false);
  };

  const handleAddServiceCancel = () => {
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="Services">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Services">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Service Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </button>
        )}

        {/* Add Service Form */}
        {showAddForm && (
          <AddServiceForm
            onSuccess={handleAddServiceSuccess}
            onCancel={handleAddServiceCancel}
          />
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {service.images[0] && (
                <div className="aspect-video w-full">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <div className="flex items-center">
                    {service.isApproved ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm">Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="w-5 h-5 mr-1" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">${service.price}</span>
                    <span className="text-sm text-gray-500">{service.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {service.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {service.place}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services added yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}