import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

type Video = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    creator: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    views: number;
    isPremium?: boolean;
    isPublic?: boolean;
    createdAt: string;
};


export default function AllVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"all" | "free" | "premium" | "trending">("all");
    const navigate = useNavigate();

    const ROWS_BEFORE_SHOW_ALL = 2;
    const VIDEOS_PER_ROW = 5;
    const initialVisibleCount = ROWS_BEFORE_SHOW_ALL * VIDEOS_PER_ROW;

    const visibleVideos = showAll
        ? videos
        : videos.slice(0, initialVisibleCount);


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);

                const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/creator/all-videos`);
                url.searchParams.set("limit", "50");
                if (activeFilter === "free") url.searchParams.set("isPremium", "false");
                if (activeFilter === "premium") url.searchParams.set("isPremium", "true");
                if (activeFilter === "trending") {
                    url.searchParams.set("sortBy", "views");
                    url.searchParams.set("sortOrder", "desc");
                } else {
                    url.searchParams.set("sortBy", "createdAt");
                    url.searchParams.set("sortOrder", "desc");
                }

                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                console.log("API Response:", data);

                if (data.status && data.data?.videos) {
                    const fetchedVideos = data.data.videos.map((v: any) => ({
                        _id: v._id,
                        title: v.title,
                        description: v.description,
                        thumbnail: v.thumbnail,
                        videoUrl: v.videoUrl,
                        creator: v.creator,
                        views: v.views ?? 0,
                        isPremium: v.isPremium,
                        isPublic: v.isPublic,
                        createdAt: v.createdAt,
                    }));

                    setVideos(fetchedVideos);
                } else {
                    console.error(
                        "Failed to load videos:",
                        data.error || data.message
                    );
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [activeFilter]);

    const handleVideoClick = (video: Video) => {
        navigate(`/video-details/${video._id}`, { state: { video } });
    };


    if (loading) {
        return <div className="text-center py-20">Loading videos...</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900 w-full">
            <div className="w-[90%] mx-auto overflow-visible p-5 flex flex-col">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 text-gray-900 dark:text-white">
                    What to Learn Next
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            All Courses
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full md:w-auto">
                        {/* Search Section */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition"
                                aria-label="Search courses"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>

                        {/* Filter Section */}
                        <div className="relative w-full sm:w-auto">
                            <button
                                aria-label="Toggle Filters"
                                className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                onClick={() => setFilterOpen((v) => !v)}
                            >
                                <Filter className="w-6 h-6" />
                                <span className="hidden sm:inline">
                                    Filters
                                </span>
                            </button>

                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 z-50 max-h-80 overflow-auto">
                                    <p className="mb-3 font-semibold text-gray-900 dark:text-white">
                                        Filter by Category
                                    </p>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-base">
                                        <li>
                                            <button onClick={() => { setActiveFilter("all"); setFilterOpen(false); }} className="w-full text-left hover:text-blue-600 transition">
                                                All Videos
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => { setActiveFilter("free"); setFilterOpen(false); }} className="w-full text-left hover:text-blue-600 transition">
                                                Free Videos
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => { setActiveFilter("premium"); setFilterOpen(false); }} className="w-full text-left hover:text-blue-600 transition">
                                                Premium Videos
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => { setActiveFilter("trending"); setFilterOpen(false); }} className="w-full text-left hover:text-blue-600 transition">
                                                Trending
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`w-full mt-4 ${showAll ? "max-h-[900px] overflow-y-auto" : ""}`}
                >
                    <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
                        {visibleVideos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => handleVideoClick(video)}
                                className="block cursor-pointer group"
                            >
                                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                                    <img
                                        src={
                                            video.thumbnail ||
                                            "/placeholder.jpg"
                                        }
                                        alt={video.title}
                                        className="w-full h-48 md:h-56 object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg md:text-xl font-semibold truncate text-gray-900 dark:text-white">
                                            {video.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {video.creator.firstName}{" "}
                                            {video.creator.lastName}
                                        </p>

                                        <div className="flex mt-3 space-x-2">
                                            {video.isPremium ? (
                                                <span className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs md:text-sm">
                                                    Premium
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs md:text-sm">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {!showAll && videos.length > initialVisibleCount && (
                    <a
                        onClick={() => setShowAll(true)}
                        className="inline-flex items-center justify-center px-4 py-2 mt-4 text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
                    >
                        Show All Videos
                    </a>
                )}
            </div>
        </div>
    );
}
