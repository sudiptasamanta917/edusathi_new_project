import React, { useState } from "react";
import { Button } from "../../components/ui/button";
// import { Card } from "../../components/ui/card";
// import {
//     div,
//     div,
//     div,
//     div,
// } from "@/components/ui/dropdown-menu";
import { FaEdit, FaArrowsAlt, FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "./Sidebar";
import QuestionModal from "./QuestionModal";

type Tab = "create" | "configure" | "publish" | "analyze";

interface Question {
    id: number;
    text: string;
    options: string[];
}

interface Page {
    id: number;
    title: string;
    items: Question[];
}

const Assessment: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>("create");
    const [pages, setPages] = useState<Page[]>([
        { id: 1, title: "Page 1", items: [] },
    ]);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

    const [showModal, setShowModal] = useState(false);


    const handleAddPage = () => {
        setPages([
            ...pages,
            { id: Date.now(), title: `Page ${pages.length + 1}`, items: [] },
        ]);
    };

    const handleAddItem = (pageId: number) => {
        setPages(
            pages.map((p) =>
                p.id === pageId
                    ? {
                          ...p,
                          items: [
                              ...p.items,
                              {
                                  id: Date.now(),
                                  text: "New Question?",
                                  options: ["Option A", "Option B"],
                              },
                          ],
                      }
                    : p
            )
        );
    };

    return (
        <div className="flex min-h-screen bg-[#282828] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 p-6">
                <div className="text-2xl font-semibold pb-5 mb-10 border-b border-gray-600">
                    Create Questions Paper
                </div>
                {/* Tabs */}
                <div className="border-b border-gray-700 mb-4">
                    <div className="w-[60%] mx-auto flex gap-6">
                        {["create", "configure", "publish", "analyze"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as Tab)}
                                    className={`pb-2 capitalize ${
                                        activeTab === tab
                                            ? "border-b-2 border-white font-semibold"
                                            : "text-gray-300"
                                    }`}
                                >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "create" && (
                    <div className="space-y-4 w-[80%] mx-auto">
                        {pages.map((page) => (
                            <div
                                key={page.id}
                                className="p-4 shadow bg-[#1f1f1f] rounded"
                            >
                                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                                    <h3 className="font-semibold text-xl">
                                        {page.title}
                                    </h3>
                                    <div className="flex gap-6 text-white">
                                        {/* Edit Page */}
                                        <div className="relative group">
                                            <FaEdit className="text-xl cursor-pointer hover:text-blue-600" />
                                            <span
                                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap 
          text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 
          transition-opacity duration-200"
                                            >
                                                Edit page title
                                            </span>
                                        </div>

                                        {/* Move Page */}
                                        <div className="relative group">
                                            <FaArrowsAlt className="text-xl cursor-pointer hover:text-green-600" />
                                            <span
                                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap 
          text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 
          transition-opacity duration-200"
                                            >
                                                Move page
                                            </span>
                                        </div>

                                        {/* Delete Page */}
                                        <div className="relative group">
                                            <FaTrash className="text-xl cursor-pointer hover:text-red-600" />
                                            <span
                                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap 
          text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 
          transition-opacity duration-200"
                                            >
                                                Delete page
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 mb-5">
                                    <div>
                                        <Button
                                            size="sm"
                                            onClick={() => setOpen(!open)}
                                            className=""
                                        >
                                            Add Item{" "}
                                            <IoMdArrowDropdown
                                                className={`transition-transform ${open ? "rotate-180" : ""}`}
                                            />
                                        </Button>
                                    </div>
                                    {/* Toggle this section */}
                                    {open && (
                                        <div className="absolute flex flex-col gap-2 mt-2 p-3 border rounded-sm w-40 bg-gray-300 text-black">
                                            <div
                                                className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2"
                                                onClick={() =>
                                                    setShowModal(true)
                                                }
                                            >
                                                Question
                                            </div>
                                            <div className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2">
                                                Text / Media
                                            </div>
                                            <div className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2">
                                                Import Questions
                                            </div>
                                            <QuestionModal
                                                isOpen={showModal}
                                                onClose={() =>
                                                    setShowModal(false)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                {page.items.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        No items yet.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {page.items.map((q) => (
                                            <li
                                                key={q.id}
                                                className="p-2 border rounded bg-white"
                                            >
                                                {q.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        <div className="relative">
                            <div className="flex justify-center">
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setOpen1(!open1)}
                                >
                                    Add Page <IoMdArrowDropdown />
                                </Button>
                            </div>
                            {/* Toggle this section */}
                            {open1 && (
                                <div className="absolute left-[44.7%] flex flex-col gap-2 mt-2 p-3 border rounded-sm w-40 bg-gray-300 text-black">
                                    <div
                                        className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2"
                                        onClick={() => handleAddPage()}
                                    >
                                        Question Page
                                    </div>
                                    <div className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2">
                                        Welcome Page
                                    </div>
                                    <div className="cursor-pointer hover:text-blue-600 border-b border-gray-400 pb-2">
                                        Thank You Page
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "configure" && (
                    <div className="w-[80%] mx-auto">
                        <h2 className="font-semibold mb-2">Configure Test</h2>
                        <p className="text-gray-500 text-sm">
                            Settings like duration, shuffle questions, etc.
                        </p>
                    </div>
                )}

                {activeTab === "publish" && (
                    <div className="w-[80%] mx-auto">
                        <h2 className="font-semibold mb-2">Publish Test</h2>
                        <p className="text-gray-500 text-sm">
                            Generate links, set visibility.
                        </p>
                    </div>
                )}

                {activeTab === "analyze" && (
                    <div className="w-[80%] mx-auto">
                        <h2 className="font-semibold mb-2">Analyze Results</h2>
                        <p className="text-gray-500 text-sm">
                            Analytics and reports will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assessment;
