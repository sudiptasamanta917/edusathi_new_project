import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

type Creator = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
};

export type Video = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    creator: Creator;
    views: number;
    isPremium?: boolean;
    isPublic?: boolean;
    createdAt: string;
};

interface VideoGridProps {
    title?: string; // Section title (e.g. “All Courses”)
    apiEndpoint: string; // API to fetch videos
    videosPerRow?: number;
    rowsBeforeShowAll?: number;
    showFilters?: boolean;
    enableSearch?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
    title = "All Courses",
    apiEndpoint,
    videosPerRow = 5,
    rowsBeforeShowAll = 2,
    showFilters = true,
    enableSearch = true,
}) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const visibleCount = rowsBeforeShowAll * videosPerRow;
    const visibleVideos = showAll ? videos : videos.slice(0, visibleCount);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await fetch(apiEndpoint, {
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                if (data.status && data.data?.videos) {
                    setVideos(
                        data.data.videos.map((v: any) => ({
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
                        }))
                    );
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
    }, [apiEndpoint]);

    const handleVideoClick = (video: Video) => {
        navigate(`/watch/${video._id}`, { state: { video } });
    };

    const filteredVideos = videos.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedVideos = showAll
        ? filteredVideos
        : filteredVideos.slice(0, visibleCount);

    if (loading) {
        return <div className="text-center py-20">Loading videos...</div>;
    }

    return (
        <div className="bg-transparent w-full">
            <div className="w-full mx-auto overflow-hidden p-5 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-300">
                        {title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full md:w-auto">
                        {enableSearch && (
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg border border-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        )}

                        {showFilters && (
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={() => setFilterOpen((v) => !v)}
                                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    <Filter className="w-6 h-6" />
                                    <span className="hidden sm:inline">
                                        Filters
                                    </span>
                                </button>

                                {filterOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 z-20">
                                        <p className="mb-3 font-semibold text-gray-900 dark:text-white">
                                            Filter by Category
                                        </p>
                                        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                            <li>
                                                <button className="w-full text-left hover:text-blue-600 transition">
                                                    All Videos
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left hover:text-blue-600 transition">
                                                    Free Videos
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left hover:text-blue-600 transition">
                                                    Premium Videos
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left hover:text-blue-600 transition">
                                                    Trending
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`w-full mt-4 ${showAll ? "max-h-[900px] overflow-y-auto" : ""}`}
                >
                    <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
                        {displayedVideos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => handleVideoClick(video)}
                                className="block cursor-pointer"
                            >
                                <div className="bg-transparent transition">
                                    <img
                                        src={
                                            video.thumbnail ||
                                            "/placeholder.jpg"
                                        }
                                        alt={video.title}
                                        className="w-full h-40 object-cover border border-gray-50"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold truncate text-white">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-gray-300 dark:text-gray-200 truncate">
                                            {video.creator.firstName}{" "}
                                            {video.creator.lastName}
                                        </p>

                                        <div className="flex mt-3 space-x-2">
                                            {video.isPremium ? (
                                                <span className="px-2 py-1 rounded bg-purple-700 text-white text-xs">
                                                    Premium
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded bg-green-600 text-white text-xs">
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

                {!showAll && videos.length > visibleCount && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-purple-700 font-semibold hover:underline text-base mt-2"
                    >
                        Show All Videos
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoGrid;
