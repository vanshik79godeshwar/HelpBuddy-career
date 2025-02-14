// components/Dashboard/ServiceList.tsx
'use client';

import { useEffect, useState } from 'react';

interface Service {
  _id: string;
  title: string;
  category: string;
  place: string;
  price: number;
  images: string[];
  isApproved: boolean;
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/services', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to headers
          },
        });

        if (!response.ok) {
          setError('Failed to load services.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setServices(data.services);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p className="text-center">Loading services...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service._id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p>Category: {service.category}</p>
            <p>Place: {service.place}</p>
            <p>Price: ${service.price}</p>
            <p>Status: {service.isApproved ? 'Approved' : 'Pending Approval'}</p>
            <div className="flex gap-2">
              {service.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Service Image ${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No services added yet.</p>
      )}
    </div>
  );
}