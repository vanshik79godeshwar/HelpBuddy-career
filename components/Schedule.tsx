import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Camera, CheckCircle, Loader2, Upload, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { IServiceRequest } from '@/models/ServiceRequest';

interface ScheduleProps {
  workerId: string;
}

const Schedule = ({ workerId }: ScheduleProps) => {
  const [requests, setRequests] = useState<IServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStates, setUploadStates] = useState<{ [key: string]: {
    uploading: boolean,
    preview: string | null,
    url: string | null
  } }>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/schedule?workerId=${workerId}`);
      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (error) {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [workerId]);

  const handleImageUpload = async (serviceRequestId: string, file: File) => {
    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      setUploadStates(prev => ({
        ...prev,
        [serviceRequestId]: {
          uploading: true,
          preview,
          url: null
        }
      }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      setUploadStates(prev => ({
        ...prev,
        [serviceRequestId]: {
          uploading: false,
          preview: null,
          url: data.secure_url
        }
      }));

      return data.secure_url;
    } catch (error) {
      setError('Failed to upload image');
      setUploadStates(prev => ({
        ...prev,
        [serviceRequestId]: {
          uploading: false,
          preview: null,
          url: null
        }
      }));
    }
  };

  const handleCompleteService = async (serviceRequestId: string) => {
    const photoUrl = uploadStates[serviceRequestId]?.url || '';
    
    try {
      setProcessingIds(prev => [...prev, serviceRequestId]);
      
      const response = await fetch(`/api/complete-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceRequestId, completionPhoto: photoUrl }),
      });

      if (response.ok) {
        await fetchRequests();
        // Clear the upload state after successful completion
        setUploadStates(prev => {
          const updated = { ...prev };
          delete updated[serviceRequestId];
          return updated;
        });
      } else {
        setError('Failed to mark service as completed');
      }
    } catch (error) {
      setError('An error occurred while completing the service');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== serviceRequestId));
    }
  };

  const clearUpload = (serviceRequestId: string) => {
    setUploadStates(prev => {
      const updated = { ...prev };
      delete updated[serviceRequestId];
      return updated;
    });
  };

  const renderServiceCard = (request: IServiceRequest) => {
    const isProcessing = processingIds.includes(request._id.toString());
    const uploadState = uploadStates[request._id.toString()];
    const hasImage = uploadState?.url || uploadState?.preview;
    const isUploading = uploadState?.uploading;
    const isPending = request.status === 'accepted';
    
    return (
      <Card key={request._id} className="overflow-hidden shadow-sm hover:shadow transition-shadow border border-gray-200">
        <CardContent className="p-0">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                request.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <h3 className="font-medium text-lg text-gray-900">{request.category}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              request.status === 'accepted' 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {format(new Date(request.dateTime), 'PPp')}
                </span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Duration: {request.duration}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Client: {request.userId.username}</span>
            </div>

            {isPending && (
              <div className="space-y-4 pt-2">
                {!hasImage ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(request._id.toString(), file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="h-8 w-8 mb-2 text-blue-500" />
                      <p className="text-sm font-medium">Upload completion photo</p>
                      <p className="text-xs mt-1">JPEG, PNG or GIF (max. 10MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    {isUploading ? (
                      <div className="flex items-center justify-center p-8 bg-gray-50 h-48">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                          <span className="text-sm text-gray-500">Uploading image...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={uploadState.url || uploadState.preview}
                          alt="Completion photo"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          onClick={() => clearUpload(request._id.toString())}
                          className="absolute top-2 right-2 p-1 h-8 w-8 bg-black/50 hover:bg-black/70 rounded-full"
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleCompleteService(request._id.toString())}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    disabled={isProcessing || isUploading || !hasImage}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {request.status === 'completed' && (
              <div className="bg-green-50 p-4 rounded-lg flex items-center text-green-700 space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Service completed successfully</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Services</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : requests.filter(r => 
                    format(new Date(r.dateTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : requests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : requests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex-1 shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Services</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your services and mark them as completed</p>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 space-y-6">
            {[...Array(3)].map((_, index) => (
              <ScheduleSkeleton key={index} />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-6">
              {requests.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No scheduled services</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    You don't have any services scheduled. New assignments will appear here when you accept them.
                  </p>
                </div>
              ) : (
                <>
                  {/* Today's services */}
                  {requests.some(r => format(new Date(r.dateTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Today</h3>
                      <div className="space-y-4">
                        {requests
                          .filter(r => format(new Date(r.dateTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                          .map(renderServiceCard)}
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming services */}
                  {requests.some(r => 
                    new Date(r.dateTime) > new Date() && 
                    format(new Date(r.dateTime), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
                  ) && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming</h3>
                      <div className="space-y-4">
                        {requests
                          .filter(r => 
                            new Date(r.dateTime) > new Date() && 
                            format(new Date(r.dateTime), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
                          )
                          .map(renderServiceCard)}
                      </div>
                    </div>
                  )}
                  
                  {/* Past services */}
                  {requests.some(r => 
                    new Date(r.dateTime) < new Date() && 
                    format(new Date(r.dateTime), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
                  ) && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Past</h3>
                      <div className="space-y-4">
                        {requests
                          .filter(r => 
                            new Date(r.dateTime) < new Date() && 
                            format(new Date(r.dateTime), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
                          )
                          .map(renderServiceCard)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

// Skeleton component for loading state
const ScheduleSkeleton = () => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardContent className="p-0">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex justify-end">
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Schedule;