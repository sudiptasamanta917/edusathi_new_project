import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";

type Video = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    creator: string;
    views: number;
    isPremium?: boolean;
    isPublic?: boolean;
    createdAt: string;
};


// const allVideos: Video[] = [
//     {
//         id: "1",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage1,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         id: "2",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage2,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         id: "3",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage3,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         id: "4",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage4,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         id: "5",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage5,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         id: "6",
//         title: "Intro to HTML",
//         author: "Jane Doe",
//         rating: 4.6,
//         reviews: "100,000",
//         price: "Free",
//         originalPrice: "₹1,499",
//         image: freeCourseImage5,
//         isFree: true,
//         isBestseller: true,
//         hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
// ];

export default function AllVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const ROWS_BEFORE_SHOW_ALL = 2;
    const VIDEOS_PER_ROW = 5;
    const initialVisibleCount = ROWS_BEFORE_SHOW_ALL * VIDEOS_PER_ROW;

    const visibleVideos = showAll
        ? videos
        : videos.slice(0, initialVisibleCount);

    // Uncomment and use for backend api
    // useEffect(() => {
    //     setLoading(true);
    //     fetch(
    //         "https://api.allorigins.win/raw?url=https://mocki.io/v1/4b27d6f3-5c19-4f85-bc0e-5a646a1e55c1"
    //     )
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setVideos(Array.isArray(data) ? data : data.videos || []);
    //             setLoading(false);
    //         })
    //         .catch(() => setLoading(false));
    // }, []);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/api/creator/all-videos`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

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
    }, []);


    if (loading) {
        return <div className="text-center py-20">Loading videos...</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900 w-full">
            <div className="w-[90%] mx-auto overflow-hidden p-5 flex flex-col">
                <h2 className="text-3xl font-extrabold mb-1 text-gray-900 dark:text-white">
                    What to Learn Next
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
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
                                className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                onClick={() => setFilterOpen((v) => !v)}
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
                    </div>
                </div>

                <div
                    className={`w-full mt-4 ${showAll ? "max-h-[900px] overflow-y-auto" : ""}`}
                >
                    <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
                        {visibleVideos.map((video) => (
                            <Link
                                key={video._id}
                                to={`/watch/${video._id}`}
                                state={{ video }}
                                className="block"
                            >
                                <div className="bg-white dark:bg-transparent transition">
                                    <img
                                        src={
                                            video.thumbnail ||
                                            "/placeholder.jpg"
                                        }
                                        alt={video.title}
                                        className="w-full h-40 object-cover border border-gray-300 dark:border-gray-50"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold truncate dark:text-white">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            {video.description}
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
                            </Link>
                        ))}
                    </div>
                </div>
                {!showAll && videos.length > initialVisibleCount && (
                    <a
                        onClick={() => setShowAll(true)}
                        className="text-purple-700 font-semibold hover:underline text-base mt-2"
                    >
                        Show All Videos
                    </a>
                )}
            </div>
        </div>
    );
}
