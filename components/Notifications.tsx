import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IServiceRequest } from '@/models/ServiceRequest';

interface NotificationsProps {
  workerId: string;
}

const Notifications = ({ workerId }: NotificationsProps) => {
  const [requests, setRequests] = useState<IServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?workerId=${workerId}`);
      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (error) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [workerId]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/accept-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, workerId }),
      });

      if (response.ok) {
        fetchRequests();
      } else {
        setError('Failed to accept request');
      }
    } catch (error) {
      setError('An error occurred while accepting the request');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New Requests</p>
                <p className="text-2xl font-semibold">{requests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-semibold">
                  {requests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex-1">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Service Requests</h2>
          <p className="text-sm text-gray-500">Manage incoming service requests</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-center">{error}</div>
        )}

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-500">Loading requests...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="p-4 grid gap-4">
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! New requests will appear here.</p>
                </div>
              ) : (
                requests.map((request) => (
                  <Card key={request._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{request.category}</h3>
                            <p className="text-sm text-gray-500">Request ID: {request._id.toString().slice(-8)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {new Date(request.dateTime).toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">Duration: {request.duration}</span>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <Button 
                            onClick={() => handleAcceptRequest(request._id.toString())}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Request
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

export default Notifications;