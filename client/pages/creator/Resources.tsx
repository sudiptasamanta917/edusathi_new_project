// src/pages/creator/Resources.tsx
import React, { useState } from "react";
import { Upload, FileText, Trash2, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import Sidebar from "./SideBar";

interface Resource {
    id: number;
    title: string;
    fileType: string;
    uploadedAt: string;
}

const Resources: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([
        {
            id: 1,
            title: "Mathematics Notes - Algebra",
            fileType: "PDF",
            uploadedAt: "2025-09-20",
        },
        {
            id: 2,
            title: "Physics Lecture Slides",
            fileType: "PPT",
            uploadedAt: "2025-09-21",
        },
    ]);

    const handleUpload = () => {
        // Placeholder for file upload API integration
        console.log("Upload resource triggered");
    };

    const handleDelete = (id: number) => {
        setResources(resources.filter((res) => res.id !== id));
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            <div className="p-6 flex-1 bg-[#282828] text-white space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Resources</h1>
                    <Button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleUpload}
                    >
                        <Upload className="w-5 h-5" /> Upload Resource
                    </Button>
                </div>

                {/* Upload Section */}
                <div className="border border-gray-700 rounded-lg p-6 bg-[#1f1f1f] text-gray-300">
                    <p className="mb-3 text-sm">
                        Upload lecture notes, slides, or reference materials for
                        students.
                    </p>
                    <input
                        type="file"
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                               file:rounded-md file:border-0 file:text-sm file:font-semibold 
                               file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                </div>

                {/* Resources List */}
                <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Your Uploaded Resources
                    </h2>
                    {resources.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                            No resources uploaded yet.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {resources.map((res) => (
                                <li
                                    key={res.id}
                                    className="flex items-center justify-between p-3 rounded-md bg-[#2a2a2a] hover:bg-[#333333]"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                        <div>
                                            <p className="text-white font-medium">
                                                {res.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {res.fileType} • Uploaded on{" "}
                                                {res.uploadedAt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-yellow-400 hover:text-yellow-500"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDelete(res.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resources;
