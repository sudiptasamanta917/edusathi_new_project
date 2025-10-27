import { Button } from '@/components/ui/button'
import React from 'react'
import { Service } from './ServiceList';


interface ServiceDetailsPopUpProps {
  setShowPopup: (show: boolean) => void;
  selectedService: Service | null;
}

const ServiceDetailsPopUp: React.FC<ServiceDetailsPopUpProps> = ({ setShowPopup, selectedService }) => {
  if (!selectedService) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'stopping': return 'text-orange-600 bg-orange-100';
      case 'restarting': return 'text-blue-600 bg-blue-100';
      case 'deleting': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 '>
      <div className='bg-white p-6 rounded-lg shadow-xl min-w-[600px] max-w-[800px] max-h-[90vh] overflow-y-auto text-gray-700'> 
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-2xl font-bold text-gray-800'>Service Details</h2>
          <Button onClick={() => setShowPopup(false)} variant="outline">Close</Button>
        </div>
        
        <div className='space-y-4'>
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Institute Name:</strong> {selectedService.instituteName}</div>
              <div><strong>Business ID:</strong> {selectedService.businessId}</div>
              <div>
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                  {selectedService.status.toUpperCase()}
                </span>
              </div>
              <div><strong>Port:</strong> {selectedService.port}</div>
            </div>
          </div>

          {/* Domain Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Domain Information</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <strong>Main Domain:</strong> 
                <a 
                  href={`http://${selectedService.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {selectedService.domain}
                </a>
              </div>
              <div>
                <strong>Admin Subdomain:</strong> 
                <a 
                  href={`http://${selectedService.subdomain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {selectedService.subdomain}
                </a>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Created At:</strong> {formatDate(selectedService.createdAt)}</div>
              <div><strong>Updated At:</strong> {formatDate(selectedService.updatedAt)}</div>
              <div><strong>Deployed At:</strong> {formatDate(selectedService.deployedAt)}</div>
              <div><strong>Stopped At:</strong> {formatDate(selectedService.stoppedAt)}</div>
              <div><strong>Restarted At:</strong> {formatDate(selectedService.restartedAt)}</div>
            </div>
          </div>

          {/* Service URLs */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Service URLs</h3>
            <div className="space-y-2">
              <div className="flex flex-col">
                <strong>Main Application:</strong>
                <a 
                  href={`http://${selectedService.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  http://{selectedService.domain}
                </a>
              </div>
              <div className="flex flex-col">
                <strong>Admin Panel:</strong>
                <a 
                  href={`http://${selectedService.subdomain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  http://{selectedService.subdomain}
                </a>
              </div>
              <div className="flex flex-col">
                <strong>Direct Port Access:</strong>
                <span className="text-gray-600 break-all">
                  http://instance-ip:{selectedService.port}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailsPopUp 