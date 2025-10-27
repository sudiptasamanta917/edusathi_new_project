import React, { useEffect, useState } from 'react'
import ServiceDetailsPopUp from './ServiceDetailsPopUp';
import { useToast } from '@/components/ui/use-toast';
import { ServicesAPI } from '@/Api/api';

export interface Service {
    _id: string;
    businessId: string;
    domain: string;
    subdomain: string;
    instituteName: string;
    port: number;
    status: 'pending' | 'running' | 'stopped' | 'failed' | 'stopping' | 'restarting' | 'deleting';
    createdAt?: string | Date;
    updatedAt?: string | Date;
    deployedAt?: string | Date;
    stoppedAt?: string | Date;
    restartedAt?: string | Date;
}


const ServiceList = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchServices = () => {
        setLoading(true);
        ServicesAPI.listServices().then(res => {
            setServices(res.services || []);
        }).catch(err => {
            toast({
                title: "Error",
                description: "Failed to fetch services.",
                variant: "destructive"
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchServices();
    }, [toast]);



    const handleStop = (id: string, serviceName: string) => {
        setLoading(true);
        ServicesAPI.stopService(id).then(res => {
            toast({
                title: "Success",
                description: `Service "${serviceName}" stopped successfully.`,
            });
            fetchServices(); // Refresh the list
        }).catch((err) => {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to stop service.",
                variant: "destructive"
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleRestart = (id: string, serviceName: string) => {
        setLoading(true);
        ServicesAPI.restartService(id).then(res => {
            toast({
                title: "Success",
                description: `Service "${serviceName}" restarted successfully.`,
            });
            fetchServices(); // Refresh the list
        }).catch((err) => {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to restart service.",
                variant: "destructive"
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleDelete = (id: string, serviceName: string) => {
        if (!window.confirm(`Are you sure you want to delete service "${serviceName}"? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        ServicesAPI.deleteService(id).then(res => {
            toast({
                title: "Success",
                description: `Service "${serviceName}" deleted successfully.`,
            });
            fetchServices(); // Refresh the list
        }).catch((err) => {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to delete service.",
                variant: "destructive"
            });
        }).finally(() => {
            setLoading(false);
        });
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
        <div>
            {
                showPopup && <ServiceDetailsPopUp setShowPopup={setShowPopup} selectedService={selectedService} />
            }
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className='text-2xl font-bold'>Services Management</h2>
                    <p className='text-gray-600'>Manage your deployed services</p>
                </div>
                <button
                    onClick={fetchServices}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            
            {loading && services.length === 0 ? (
                <div className="text-center py-8">
                    <p>Loading services...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No services found</p>
                </div>
            ) : (
                <div className='mt-4 p-2 overflow-x-auto'>
                    <table className='table table-bordered w-full border border-gray-300'>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Sr</th>
                                <th className="px-4 py-2 text-left">Institute Name</th>
                                <th className="px-4 py-2 text-left">Domain</th>
                                <th className="px-4 py-2 text-left">Admin Domain</th>
                                <th className="px-4 py-2 text-left">Port</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                services.map((service, index) => (
                                    <tr 
                                        key={service._id} 
                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setSelectedService(service)
                                            setShowPopup(true);
                                        }}
                                    >
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2 font-medium">{service.instituteName}</td>
                                        <td className="px-4 py-2">
                                            <a 
                                                href={`http://${service.domain}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {service.domain}
                                            </a>
                                        </td>
                                        <td className="px-4 py-2">
                                            <a 
                                                href={`http://${service.subdomain}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {service.subdomain}
                                            </a>
                                        </td>
                                        <td className="px-4 py-2">{service.port}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                                {service.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className='px-4 py-2 space-x-2'>
                                            <button
                                                onClick={e => { 
                                                    e.stopPropagation(); 
                                                    handleStop(service._id, service.instituteName); 
                                                }}
                                                disabled={loading || service.status === 'stopped' || service.status === 'stopping'}
                                                className='px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                Stop
                                            </button>
                                            <button
                                                onClick={e => { 
                                                    e.stopPropagation(); 
                                                    handleRestart(service._id, service.instituteName); 
                                                }}
                                                disabled={loading || service.status === 'restarting'}
                                                className='px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                Restart
                                            </button>
                                            <button
                                                onClick={e => { 
                                                    e.stopPropagation(); 
                                                    handleDelete(service._id, service.instituteName); 
                                                }}
                                                disabled={loading || service.status === 'deleting'}
                                                className='px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ServiceList