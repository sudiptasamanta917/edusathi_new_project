import React, { useEffect, useState } from "react";
import freeCourseImage5 from "../../../src/assets/courseImages/freeCourseImages/maxresdefault (5).jpg";

type Video = {
    id: string;
    title: string;
    author: string;
    rating: number;
    reviews: string;
    price: string;
    originalPrice: string;
    image: string;
    isPremium?: boolean;
    isBestseller?: boolean;
    isFree?: boolean;
};

const dummyTrendingVideos: Video[] = [
    {
        id: "1",
        title: "100 Days of Code: The Complete Python Pro...",
        author: "Dr. Angela Yu, Developer and Lead...",
        rating: 4.7,
        reviews: "394,476",
        price: "₹519",
        originalPrice: "₹3,199",
        image: freeCourseImage5,
        isPremium: true,
        isBestseller: true,
    },
    // ... 
];

const VISIBLE_COUNT = 5;

function VideoCarousel({
    videos,
    title,
    subtitle,
    showFreeBadge = false,
}: {
    videos: Video[];
    title: string;
    subtitle: string;
    showFreeBadge?: boolean;
}) {
    const [startIndex, setStartIndex] = useState(0);
    const handleRight = () => {
        if (startIndex + VISIBLE_COUNT < videos.length)
            setStartIndex(startIndex + 1);
    };
    const handleLeft = () => {
        if (startIndex > 0) setStartIndex(startIndex - 1);
    };
    const visibleVideos = videos.slice(startIndex, startIndex + VISIBLE_COUNT);

    return (
        <section className="my-5 px-5 w-full">
            <p className="text-xl md:text-2xl font-semibold mb-6 text-[#2a2b3f] dark:text-white">
                {subtitle}
            </p>
            <div className="relative flex items-center mt-5">
                <button
                    className={`z-10 rounded-full bg-white dark:bg-transparent p-2 absolute left-0 top-1/2 -translate-y-1/2 transition-opacity ${
                        startIndex === 0
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                    }`}
                    onClick={handleLeft}
                    aria-label="Scroll Left"
                >
                    <svg width="24" height="24">
                        <path
                            d="M15 18l-6-6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
                <div className="w-full overflow-hidden">
                    <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
                        {visibleVideos.map((video) => (
                            <div key={video.id}>
                                <div className="bg-white dark:bg-transparent transition">
                                    <img
                                        src={video.image}
                                        alt={video.title}
                                        className="w-full h-40 object-cover border border-gray-300 dark:border-gray-50"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold truncate">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 truncate">
                                            {video.author}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <span className="text-sm font-semibold text-yellow-600">
                                                {video.rating}
                                            </span>
                                            <span className="ml-1 text-gray-600 text-xs">
                                                ★
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({video.reviews})
                                            </span>
                                        </div>
                                        <div className="flex mt-4 space-x-2">
                                            {video.isPremium && (
                                                <span className="px-2 py-1 rounded bg-purple-700 text-white text-xs">
                                                    Premium
                                                </span>
                                            )}
                                            {video.isBestseller && (
                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs">
                                                    Bestseller
                                                </span>
                                            )}
                                            {showFreeBadge && (
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
                <button
                    className={`z-10 rounded-full bg-white shadow-md p-2 absolute right-0 top-1/2 -translate-y-1/2 transition-opacity ${
                        startIndex + VISIBLE_COUNT >= videos.length
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                    }`}
                    onClick={handleRight}
                    aria-label="Scroll Right"
                >
                    <svg width="24" height="24">
                        <path
                            d="M9 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
}

export default function TrendingVideos() {
    const [videos, setVideos] = useState<Video[]>(dummyTrendingVideos);
    const [loading, setLoading] = useState(false);

    // Uncomment and use this effect when backend API is ready
    /*
    useEffect(() => {
        setLoading(true);
        fetch("/api/trendingVideos") // Replace with actual endpoint
            .then((res) => res.json())
            .then((data) => {
                setVideos(Array.isArray(data) ? data : data.videos || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);
    */

    if (loading) {
        return (
            <div className="text-center py-20">Loading trending videos...</div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 mt-0">
            <div className="w-[90%] mx-auto py-1">
                <VideoCarousel
                    videos={videos}
                    title=""
                    subtitle="Trending courses"
                />
            </div>
        </div>
    );
}
