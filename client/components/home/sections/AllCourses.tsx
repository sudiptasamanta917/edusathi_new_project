import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, BookOpen } from "lucide-react";
import { PublicAPI } from "@/Api/api";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { MdVerified } from "react-icons/md";

type Course = {
    _id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail?: string;
    isPaid: boolean;
    price: number;
    creator: { _id: string; name: string; email: string } | null;
    playlistCount: number;
    createdAt: string;
    updatedAt: string;
};

export default function AllCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<
        "all" | "free" | "paid"
    >("all");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const hasFetched = useRef(false);
    const filterMenuRef = useRef<HTMLDivElement | null>(null);

    const ROWS_BEFORE_SHOW_ALL = 2;
    const COURSES_PER_ROW = 4;
    const initialVisibleCount = ROWS_BEFORE_SHOW_ALL * COURSES_PER_ROW;

    // Improved: Close filter dropdown if click outside or press Escape
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                filterMenuRef.current &&
                !filterMenuRef.current.contains(e.target as Node)
            ) {
                setFilterOpen(false);
            }
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setFilterOpen(false);
        }
        if (filterOpen) {
            document.addEventListener("mousedown", handleClick);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [filterOpen]);

    useEffect(() => {
        if (hasFetched.current) return; // Prevent duplicate fetch
        hasFetched.current = true;

        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null); // clear error before fetch
                const data = await PublicAPI.getAllCourses();
                if (data.status && data.data?.courses) {
                    setCourses(data.data.courses);
                } else {
                    setError(
                        data.error || data.message || "Failed to load courses."
                    );
                }
            } catch (err) {
                setError((err as Error).message || "Error fetching courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Defensive checks and fallback for missing data
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const lower = searchTerm.toLowerCase();
            const creatorName = course.creator?.name?.toLowerCase() || "";
            const matchesSearch =
                course.title.toLowerCase().includes(lower) ||
                course.description.toLowerCase().includes(lower) ||
                creatorName.includes(lower) ||
                course.subject.toLowerCase().includes(lower);

            const matchesFilter =
                selectedFilter === "all" ||
                (selectedFilter === "free" && !course.isPaid) ||
                (selectedFilter === "paid" && course.isPaid);

            return matchesSearch && matchesFilter;
        });
    }, [courses, searchTerm, selectedFilter]);

    const visibleCourses = useMemo(() => {
        return showAll
            ? filteredCourses
            : filteredCourses.slice(0, initialVisibleCount);
    }, [filteredCourses, showAll, initialVisibleCount]);

    console.log(visibleCourses);

    const handleCourseClick = (course: Course) => {
        navigate(`/course/${course._id}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };


    // Loading spinner
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 w-full">
                <div className="w-[90%] mx-auto py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading courses...
                    </p>
                </div>
            </div>
        );
    }
    // Error message
    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 w-full">
                <div className="w-[90%] mx-auto py-20 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 z-20 border border-gray-200 dark:border-gray-700"
                                    ref={filterMenuRef}
                                    tabIndex={-1}
                                >
                                    <p className="mb-3 font-semibold text-gray-900 dark:text-white">
                                        Filter by Type
                                    </p>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                        {["all", "free", "paid"].map((type) => (
                                            <li key={type}>
                                                <button
                                                    className={`w-full text-left hover:text-blue-600 transition
                            ${
                                selectedFilter === type
                                    ? "text-blue-600 font-semibold"
                                    : ""
                            }`}
                                                    onClick={() => {
                                                        setSelectedFilter(
                                                            type as
                                                                | "all"
                                                                | "free"
                                                                | "paid"
                                                        );
                                                        setFilterOpen(false);
                                                    }}
                                                >
                                                    {type === "all"
                                                        ? "All Courses"
                                                        : type === "free"
                                                          ? "Free Courses"
                                                          : "Paid Courses"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* No courses found state */}
                {visibleCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchTerm || selectedFilter !== "all"
                                ? "No courses found matching your criteria"
                                : "No courses available"}
                        </p>
                    </div>
                ) : (
                    <div>
                        <div
                            className={`w-full mt-4 ${showAll ? "max-h-[900px] overflow-y-auto" : ""}`}
                        >
                            <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
                                {visibleCourses.map((video) => (
                                    <div
                                        key={video._id}
                                        onClick={() => handleCourseClick(video)}
                                        className="block cursor-pointer"
                                        tabIndex={0}
                                        aria-label={video.title}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleCourseClick(video);
                                        }}
                                    >
                                        <div className="bg-white dark:bg-transparent transition">
                                            <img
                                                src={
                                                    video.thumbnail
                                                        ? video.thumbnail
                                                        : "./class5.avif"
                                                }
                                                alt={video.title}
                                                className="w-full h-40 object-cover border border-gray-300 dark:border-gray-50"
                                                onError={(e) => {
                                                    (
                                                        e.currentTarget as HTMLImageElement
                                                    ).src = "./class5.avif";
                                                }}
                                            />
                                            <div className="px-2 pt-2 pb-4">
                                                <h3 className="text-base font-semibold truncate dark:text-white">
                                                    {video.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                    {video.creator?.name ||
                                                        "Unknown Creator"}
                                                </p>
                                                <div className="text-xs flex flex-wrap gap-4">
                                                    <p className="">
                                                        Publish{" "}
                                                        {formatDate(
                                                            video.createdAt
                                                        )}
                                                    </p>
                                                    <p className="text-xs">
                                                        Updated{" "}
                                                        {formatDate(
                                                            video.updatedAt
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-xs">
                                                    Enrolled: 0 students
                                                </p>
                                                <div className="flex mt-3 space-x-2">
                                                    {video.isPaid ? (
                                                        <span className="px-2 py-1 rounded bg-purple-700 text-white text-xs flex items-center gap-2">
                                                            <AiFillSafetyCertificate />
                                                            Premium
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded bg-green-600 text-white text-xs flex items-center gap-2">
                                                            <MdVerified />
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
                        {!showAll &&
                            filteredCourses.length > initialVisibleCount && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline text-base mt-6 self-start transition-colors"
                                    aria-label="Show All Courses"
                                >
                                    Show All Courses (
                                    {Math.max(
                                        0,
                                        filteredCourses.length -
                                            initialVisibleCount
                                    )}{" "}
                                    more)
                                </button>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}
