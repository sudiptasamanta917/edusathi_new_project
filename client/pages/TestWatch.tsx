import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";

export default function TestWatch() {
    const { id } = useParams();
    const location = useLocation();
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-2xl font-bold mb-4">Test Watch Page</h1>
                <div className="bg-white p-4 rounded shadow">
                    <p><strong>Video ID:</strong> {id}</p>
                    <p><strong>Location State:</strong></p>
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
                        {JSON.stringify(location.state, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
