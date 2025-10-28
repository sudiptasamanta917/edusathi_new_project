import React, { useState, useEffect } from "react";
import axios from "axios";
import Ai1 from "../../../src/assets/courseImages/AI1.webp";
import Ai2 from "../../../src/assets/courseImages/AI-courses.webp";
import Ai3 from "../../../src/assets/courseImages/best-ai3.jpg";
import Ai4 from "../../../src/assets/courseImages/AI5.jpg";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
const defaultImages = [Ai1, Ai2, Ai3, Ai4];

type Course = {
    _id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string | null;
    isPaid: boolean;
    price: number;
    creator: {
        _id: string;
        name: string;
        email: string;
    } | null;
    playlistCount: number;
    createdAt: string;
    updatedAt: string;
};

// CourseCard
const CourseCard: React.FC<{ course: Course; defaultImage: string }> = ({ course, defaultImage }) => (
    <a 
        href={`/course/${course._id}`}
        className="bg-[#fdfdfe] dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col w-full max-w-xs min-w-[16rem] hover:shadow-lg transition-shadow cursor-pointer"
    >
        <div className="h-32 rounded-lg overflow-hidden mb-4">
            <img
                src={course.thumbnail || defaultImage}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                }}
            />
        </div>
        <div className="font-semibold text-base mb-1 line-clamp-2">{course.title}</div>
        <div className="text-gray-600 dark:text-gray-300 text-xs mb-2 line-clamp-2">
            {course.creator?.name || "EduSathi Instructor"}
        </div>
        <div className="flex items-center mb-3 space-x-2 flex-wrap gap-1">
            {course.isPaid && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                    <svg
                        className="w-4 h-4 inline-block"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 2l2.09 6.26L18 9.27l-5 3.64L14.18 18 10 14.77 5.82 18 7 12.91l-5-3.64 5.91-.91L10 2z" />
                    </svg>
                    Premium
                </span>
            )}
            {!course.isPaid && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    Free
                </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.grade}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.level}
            </span>
        </div>
        {course.isPaid && course.price > 0 && (
            <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-lg">₹{course.price}</span>
            </div>
        )}
        {course.playlistCount > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {course.playlistCount} playlist{course.playlistCount > 1 ? 's' : ''}
            </div>
        )}
    </a>
);

// Main CourseVideos section with carousel and tabs
const CourseVideos: React.FC = () => {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all courses on mount to extract unique subjects
    useEffect(() => {
        fetchSubjects();
    }, []);

    // Fetch courses when active tab changes
    useEffect(() => {
        if (subjects.length > 0) {
            fetchCoursesBySubject(subjects[activeTab]);
        }
    }, [activeTab, subjects]);

    // Reset carousel index when tab changes
    useEffect(() => setCarouselIndex(0), [activeTab]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URL}/api/creator/public/courses`, {
                params: { limit: 100 }
            });
            
            if (response.data.status && response.data.data.courses) {
                const allCourses = response.data.data.courses;
                const uniqueSubjects = Array.from(
                    new Set(allCourses.map((course: Course) => course.subject))
                ) as string[];
                
                setSubjects(uniqueSubjects.length > 0 ? uniqueSubjects : ["Programming", "Mathematics", "Science", "English"]);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching subjects:", err);
            setSubjects(["Programming", "Mathematics", "Science", "English", "History", "Arts"]);
            setLoading(false);
        }
    };

    const fetchCoursesBySubject = async (subject: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URL}/api/creator/public/courses`, {
                params: {
                    subject: subject,
                    limit: 20,
                    sortBy: "createdAt",
                    sortOrder: "desc"
                }
            });
            
            if (response.data.status && response.data.data.courses) {
                setCourses(response.data.data.courses);
            } else {
                setCourses([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setCourses([]);
            setLoading(false);
        }
    };

    const itemsPerPage = 4;
    const canGoLeft = carouselIndex > 0;
    const canGoRight = carouselIndex + itemsPerPage < courses.length;
    const visibleCourses = courses.slice(
        carouselIndex,
        carouselIndex + itemsPerPage
    );

    const getDefaultImage = (index: number) => {
        return defaultImages[index % defaultImages.length];
    };

    return (
        <section className="w-full bg-white dark:bg-slate-900">
            <div className="w-[90%] py-5 px-4 mx-auto">
                <h2 className="text-3xl font-bold mb-2">
                    Skills to transform your career and life
                </h2>
                <p className="text-gray-600 dark:text-gray-200 mb-8">
                    From critical skills to technical topics, EduSathi supports
                    your professional development.
                </p>
                
                {loading && subjects.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading courses...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex mb-8 space-x-8 border-b border-gray-300 dark:border-gray-200 overflow-x-auto">
                            {subjects.map((subject, idx) => (
                                <button
                                    key={subject}
                                    onClick={() => setActiveTab(idx)}
                                    className={`pb-3 text-base font-medium whitespace-nowrap ${
                                        activeTab === idx
                                            ? "border-b-2 border-black text-black dark:border-white dark:text-white"
                                            : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>
                {/* Carousel with arrows */}
                <div className="relative flex items-center">
                    {canGoLeft && (
                        <button
                            className="absolute left-[-2rem] z-10 bg-white dark:bg-slate-900 border rounded-full shadow p-2 top-1/2 -translate-y-1/2"
                            onClick={() => setCarouselIndex((i) => i - 1)}
                            aria-label="Previous"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}
                    <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 w-full">
                        {loading ? (
                            <div className="col-span-6 text-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading courses...</p>
                            </div>
                        ) : visibleCourses.length === 0 ? (
                            <div className="col-span-6 text-center py-16 text-gray-400 dark:text-gray-200">
                                No courses available for this subject yet.
                            </div>
                        ) : (
                            visibleCourses.map((course, index) => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    defaultImage={getDefaultImage(index)}
                                />
                            ))
                        )}
                    </div>
                    {canGoRight && (
                        <button
                            className="absolute right-[-2rem] z-10 bg-white dark:bg-slate-900 border rounded-full shadow p-2 top-1/2 -translate-y-1/2"
                            onClick={() => setCarouselIndex((i) => i + 1)}
                            aria-label="Next"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                        <div className="mt-6">
                            <a
                                href="/catalog"
                                className="text-purple-700 font-semibold hover:underline text-base"
                            >
                                Show all {subjects[activeTab]} courses &rarr;
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default CourseVideos;