import React, { useState, useEffect } from "react";
import Ai1 from "../../../src/assets/courseImages/AI1.webp";
import Ai2 from "../../../src/assets/courseImages/AI-courses.webp";
import Ai3 from "../../../src/assets/courseImages/best-ai3.jpg";
import Ai4 from "../../../src/assets/courseImages/AI5.jpg";

type Course = {
    id: string;
    title: string;
    subtitle: string;
    instructor: string;
    image: string;
    badge?: string;
    badgeType?: "bestseller" | "premium" | "none";
    rating: number;
    ratingCount: number;
    price: number;
    oldPrice: number;
};

// Tab definitions
const tabs = [
    "Artificial Intelligence (AI)",
    "Web Development",
    "Microsoft Excel",
    "AI Agents & Agentic AI",
    "Digital Marketing",
    "Amazon AWS",
];

// Courses for each tab (fill out more as needed)
const coursesByTab: Record<string, Course[]> = {
    "Artificial Intelligence (AI)": [
        {
            id: "1",
            title: "The AI Engineer Course 2025: Complete AI Engineer Bootcamp",
            subtitle: "365 Careers",
            instructor: "",
            image: Ai1,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.6,
            ratingCount: 9707,
            price: 519,
            oldPrice: 3000,
        },
        {
            id: "2",
            title: "AI for Strategic HR Operations and Compliance [EN]",
            subtitle: "PapaHR: #1 Udemy HR Instructor · 115K Learners",
            instructor: "",
            image: Ai2,
            badge: "",
            badgeType: "none",
            rating: 4.4,
            ratingCount: 91,
            price: 529,
            oldPrice: 1799,
        },
        {
            id: "3",
            title: "Data Science & AI Masters 2025 - From Python To Gen AI",
            subtitle: "Dr. Satyajit Pattnaik, Satyajit Pattnaik",
            instructor: "",
            image: Ai3,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.4,
            ratingCount: 1385,
            price: 529,
            oldPrice: 3069,
        },
        {
            id: "4",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "5",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
        {
            id: "6",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "7",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
    ],
    // Example data for tabs—add similar objects for your other categories.
    "Web Development": [
        {
            id: "1",
            title: "React Mastery Bootcamp",
            subtitle: "WebPro Inc.",
            instructor: "",
            image: Ai2,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.7,
            ratingCount: 2200,
            price: 499,
            oldPrice: 2199,
        },
        {
            id: "2",
            title: "React Mastery Bootcamp",
            subtitle: "WebPro Inc.",
            instructor: "",
            image: Ai2,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.7,
            ratingCount: 2200,
            price: 499,
            oldPrice: 2199,
        },
        {
            id: "3",
            title: "React Mastery Bootcamp",
            subtitle: "WebPro Inc.",
            instructor: "",
            image: Ai2,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.7,
            ratingCount: 2200,
            price: 499,
            oldPrice: 2199,
        },
        {
            id: "4",
            title: "React Mastery Bootcamp",
            subtitle: "WebPro Inc.",
            instructor: "",
            image: Ai2,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.7,
            ratingCount: 2200,
            price: 499,
            oldPrice: 2199,
        },
        {
            id: "5",
            title: "React Mastery Bootcamp",
            subtitle: "WebPro Inc.",
            instructor: "",
            image: Ai2,
            badge: "Bestseller",
            badgeType: "bestseller",
            rating: 4.7,
            ratingCount: 2200,
            price: 499,
            oldPrice: 2199,
        },
        // additional courses ...
    ],
    "Microsoft Excel": [
        {
            id: "1",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "2",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
    ],
    "AI Agents & Agentic AI": [
        {
            id: "1",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "2",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
    ],
    "Digital Marketing": [
        {
            id: "1",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "2",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
    ],
    "Amazon AWS": [
        {
            id: "1",
            title: "Artificial Intelligence for Business + ChatGPT Prize [2025]",
            subtitle: "Hadelin de Ponteves, Kirill Eremenko",
            instructor: "",
            image: Ai4,
            badge: "Premium",
            badgeType: "premium",
            rating: 4.5,
            ratingCount: 4798,
            price: 659,
            oldPrice: 3559,
        },
        {
            id: "2",
            title: "Yet Another AI Engineering Course",
            subtitle: "Instructor Name",
            instructor: "",
            image: Ai1,
            badge: "",
            badgeType: "none",
            rating: 4.2,
            ratingCount: 420,
            price: 399,
            oldPrice: 1899,
        },
    ],
};

// CourseCard
const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-[#fdfdfe] dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col w-full max-w-xs min-w-[16rem]">
        <div className="h-32 rounded-lg overflow-hidden mb-4">
            <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
        <div className="font-semibold text-base mb-1">{course.title}</div>
        <div className="text-gray-600 dark:text-gray-300 text-xs mb-4">{course.subtitle}</div>
        <div className="flex items-center mb-3 space-x-2">
            {course.badgeType === "bestseller" && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    Bestseller
                </span>
            )}
            {course.badgeType === "premium" && (
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
            {course.rating > 0 && (
                <>
                    <span className="flex items-center text-xs">
                        <span className="text-yellow-500 font-bold mr-1">
                            {course.rating}
                        </span>
                        <svg
                            className="w-4 h-4 fill-yellow-400"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.878 3.09 1.122-6.545L.366 7.91l6.564-.955L10 1l3.07 5.955 6.564.955-4.878 4.635 1.122 6.545z" />
                        </svg>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">
                        {course.ratingCount.toLocaleString()} ratings
                    </span>
                </>
            )}
        </div>
        {/* Uncomment for price display if needed
    <div className="flex items-center gap-2 mb-2">
      <span className="font-semibold text-lg">₹{course.price}</span>
      <span className="text-gray-500 line-through text-sm">₹{course.oldPrice}</span>
    </div>
    */}
    </div>
);

// Main CourseVideos section with carousel and tabs
const CourseVideos: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const courses = coursesByTab[tabs[activeTab]] ?? [];
    const itemsPerPage = 4;
    const canGoLeft = carouselIndex > 0;
    const canGoRight = carouselIndex + itemsPerPage < courses.length;
    const visibleCourses = courses.slice(
        carouselIndex,
        carouselIndex + itemsPerPage
    );

    useEffect(() => setCarouselIndex(0), [activeTab]);

    return (
        <section className="w-full bg-white dark:bg-slate-900">
            <div className="w-[90%] py-5 px-4 mx-auto">
                <h2 className="text-3xl font-bold mb-2">
                    Skills to transform your career and life
                </h2>
                <p className="text-gray-600 dark:text-gray-200 mb-8">
                    From critical skills to technical topics, Udemy supports
                    your professional development.
                </p>
                <div className="flex mb-8 space-x-8 border-b border-gray-300 dark:border-gray-200 overflow-x-auto">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(idx)}
                            className={`pb-3 text-base font-medium whitespace-nowrap ${
                                activeTab === idx
                                    ? "border-b-2 border-black text-black dark:border-white dark:text-white"
                                    : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            {tab}
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
                        {visibleCourses.map((course) => (
                            <CourseCard
                                key={course.id + course.title}
                                course={course}
                            />
                        ))}
                        {visibleCourses.length === 0 && (
                            <div className="col-span-6 text-center py-16 text-gray-400 dark:text-gray-200">
                                No courses available for this tab.
                            </div>
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
                        href="#"
                        className="text-purple-700 font-semibold hover:underline text-base"
                    >
                        Show all {tabs[activeTab]} courses &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CourseVideos;
