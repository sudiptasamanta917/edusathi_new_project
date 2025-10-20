import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Search, Filter, User, BookOpen, Clock } from "lucide-react";
import { PublicAPI } from "@/Api/api";

type Course = {
    _id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string;
    isPaid: boolean;
    price: number;
    creator: {
        _id: string;
        name: string;
        email: string;
    };
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
    const [selectedFilter, setSelectedFilter] = useState("all");
    const navigate = useNavigate();

    const ROWS_BEFORE_SHOW_ALL = 2;
    const COURSES_PER_ROW = 4;
    const initialVisibleCount = ROWS_BEFORE_SHOW_ALL * COURSES_PER_ROW;

    // Filter courses based on search and filter criteria
    const filteredCourses = courses.filter(course => {
    const lower = searchTerm.toLowerCase();
    const creatorName = course.creator?.name || "";
    const matchesSearch = (course.title || "").toLowerCase().includes(lower) ||
                (course.description || "").toLowerCase().includes(lower) ||
                creatorName.toLowerCase().includes(lower) ||
                (course.subject || "").toLowerCase().includes(lower);

        const matchesFilter = selectedFilter === "all" ||
                            (selectedFilter === "free" && !course.isPaid) ||
                            (selectedFilter === "paid" && course.isPaid);

        return matchesSearch && matchesFilter;
    });

    const visibleCourses = showAll
        ? filteredCourses
        : filteredCourses.slice(0, initialVisibleCount);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                console.log("Fetching all courses...");

                const data = await PublicAPI.getAllCourses();
                console.log("API Response:", data);

                if (data.status && data.data?.courses) {
                    setCourses(data.data.courses);
                } else {
                    console.error("Failed to load courses:", data.error || data.message);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseClick = (course: Course) => {
        // Navigate to course detail page (you can create this route)
        navigate(`/course/${course._id}`, { state: { course } });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 w-full">
                <div className="w-[90%] mx-auto py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 w-full">
            <div className="w-[90%] mx-auto overflow-hidden p-5 flex flex-col">
                <h2 className="text-3xl font-extrabold mb-1 text-gray-900 dark:text-white">
                    Explore All Courses
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            From All Creators ({courses.length} courses)
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
                                <span className="hidden sm:inline">Filters</span>
                            </button>

                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 z-20 border border-gray-200 dark:border-gray-700">
                                    <p className="mb-3 font-semibold text-gray-900 dark:text-white">
                                        Filter by Type
                                    </p>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                        <li>
                                            <button 
                                                className={`w-full text-left hover:text-blue-600 transition ${selectedFilter === 'all' ? 'text-blue-600 font-semibold' : ''}`}
                                                onClick={() => {setSelectedFilter('all'); setFilterOpen(false);}}
                                            >
                                                All Courses
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className={`w-full text-left hover:text-blue-600 transition ${selectedFilter === 'free' ? 'text-blue-600 font-semibold' : ''}`}
                                                onClick={() => {setSelectedFilter('free'); setFilterOpen(false);}}
                                            >
                                                Free Courses
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className={`w-full text-left hover:text-blue-600 transition ${selectedFilter === 'paid' ? 'text-blue-600 font-semibold' : ''}`}
                                                onClick={() => {setSelectedFilter('paid'); setFilterOpen(false);}}
                                            >
                                                Paid Courses
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="mt-4 mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {searchTerm || selectedFilter !== 'all' 
                            ? `Showing ${filteredCourses.length} of ${courses.length} courses`
                            : `Showing ${visibleCourses.length} of ${courses.length} courses`
                        }
                    </p>
                </div>

                <div className={`w-full mt-4 ${showAll ? "max-h-[900px] overflow-y-auto" : ""}`}>
                    {visibleCourses.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchTerm || selectedFilter !== 'all' 
                                    ? "No courses found matching your criteria"
                                    : "No courses available"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                            {visibleCourses.map((course) => (
                                <div
                                    key={course._id}
                                    onClick={() => handleCourseClick(course)}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    {/* Course Thumbnail */}
                                    <div className="relative">
                                        <img
                                            src={course.thumbnail || "/placeholder.jpg"}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            {course.isPaid ? (
                                                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                                                    ₹{course.price}
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Course Meta */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span>{course.creator.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{course.playlistCount} playlists</span>
                                            </div>
                                        </div>

                                        {/* Course Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                                {course.subject}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                                Grade {course.grade}
                                            </span>
                                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded">
                                                {course.level}
                                            </span>
                                        </div>

                                        {/* Course Footer */}
                                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                            <span>Created {formatDate(course.createdAt)}</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>Updated {formatDate(course.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!showAll && filteredCourses.length > initialVisibleCount && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline text-base mt-6 self-start transition-colors"
                    >
                        Show All Courses ({filteredCourses.length - initialVisibleCount} more)
                    </button>
                )}
            </div>
        </div>
    );
}
