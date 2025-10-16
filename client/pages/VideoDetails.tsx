// import Navbar from "@/components/layout/Navbar";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// interface VideoDetailsData {
//     id: string;
//     title: string;
//     subtitle: string;
//     creator: string;
//     creatorBio: string;
//     lastUpdated: string;
//     language: string;
//     subtitles: string[];
//     rating: number;
//     ratingsCount: number;
//     learnersCount: number;
//     price: number;
//     previewUrl?: string;
//     learnList: string[];
// }

// //  Mock video data
// const MOCK_VIDEOS: VideoDetailsData[] = [
//     {
//         id: "1",
//         title: "Artificial Intelligence Risk and Cyber Security Course 2025",
//         subtitle:
//             "Learn how to govern and secure Artificial Intelligence and Machine Learning systems",
//         creator: "Taimur Ijlal",
//         creatorBio: "Award-winning cybersecurity leader and instructor",
//         lastUpdated: "Jan 2025",
//         language: "English",
//         subtitles: ["English [Auto]", "Korean [Auto]", "Hindi [Auto]"],
//         rating: 4.4,
//         ratingsCount: 7876,
//         learnersCount: 20813,
//         price: 2359,
//         previewUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
//         learnList: [
//             "Artificial Intelligence and Machine Learning risks",
//             "Cyber-security risks of AI systems",
//             "How ChatGPT can help you in Cybersecurity",
//             "How to create an AI governance framework",
//             "How to implement controls in a ML model lifecycle",
//         ],
//     },
// ];

// const VideoDetails: React.FC = () => {
//     const { videoId } = useParams<{ videoId: string }>();
//     const [video, setVideo] = useState<VideoDetailsData | null>(null);

//     useEffect(() => {
//         const foundVideo = MOCK_VIDEOS.find((v) => v.id === videoId);
//         setVideo(foundVideo || MOCK_VIDEOS[0]);
//     }, [videoId]);

//     if (!video) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-red-400 dark:bg-black bg-white">
//                 Video not found.
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
//             <Navbar />
//             <div className="relative mt-20 py-12 px-4 md:px-8">
//                 <div className="flex flex-col lg:flex-row lg:gap-5 xl:gap-8 2xl:gap-10 xl:w-[80%] w-[90%] mx-auto">
//                     {/* LEFT CONTENT */}
//                     <div className="flex-1 lg:max-w-[70%]">
//                         {/* Title */}
//                         <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
//                             {video.title}
//                         </h1>
//                         <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
//                             {video.subtitle}
//                         </p>

//                         {/* Creator Info */}
//                         <div className="mt-6 text-gray-700 dark:text-gray-300 text-sm flex flex-wrap gap-2">
//                             <span>
//                                 Created by{" "}
//                                 <a
//                                     href="#"
//                                     className="text-blue-500 dark:text-blue-400 underline font-semibold"
//                                 >
//                                     {video.creator} | {video.creatorBio}
//                                 </a>
//                             </span>
//                         </div>

//                         {/* Meta Info */}
//                         <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm flex flex-wrap gap-4">
//                             <span>Last updated {video.lastUpdated}</span>
//                             <span>{video.language}</span>
//                             <span>{video.subtitles.join(", ")}</span>
//                         </div>

//                         {/* Stats Card */}
//                         <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded p-5">
//                             <div className="bg-purple-700 text-white text-xs font-semibold rounded-full px-3 py-1">
//                                 Premium
//                             </div>
//                             <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
//                                 Access this top-rated course, plus 26,000+ more
//                                 top-rated courses, with a Udemy plan.
//                                 <span className="text-blue-500 dark:text-blue-400 ml-2 font-medium cursor-pointer">
//                                     See Plans & Pricing
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="text-2xl font-semibold text-gray-900 dark:text-white">
//                                     {video.rating.toFixed(1)}
//                                 </div>
//                                 <div className="flex flex-col text-xs text-gray-700 dark:text-gray-300">
//                                     <span>{video.ratingsCount} ratings</span>
//                                     <span>{video.learnersCount} learners</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* What you'll learn */}
//                         <div className="mt-8 rounded p-6 border dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                             <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//                                 What you'll learn
//                             </h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
//                                 {video.learnList.map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className="flex items-start gap-2 text-gray-800 dark:text-gray-200"
//                                     >
//                                         <span className="mt-1 text-green-500 dark:text-green-400">
//                                             &#10003;
//                                         </span>
//                                         <span>{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT SIDEBAR */}
//                     <div className="mt-12 lg:mt-0 w-full lg:max-w-sm xl:max-w-md bg-white dark:bg-gray-900 text-black dark:text-white shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded p-6 md:p-8 flex flex-col gap-6">
//                         {/* Preview */}
//                         <div className="flex flex-col items-center">
//                             <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded mb-3 overflow-hidden">
//                                 {video.previewUrl ? (
//                                     <video
//                                         src={video.previewUrl}
//                                         controls
//                                         className="w-full h-full object-cover rounded"
//                                     />
//                                 ) : (
//                                     <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mt-8">
//                                         <svg
//                                             className="w-10 h-10 text-white"
//                                             fill="currentColor"
//                                             viewBox="0 0 20 20"
//                                         >
//                                             <path d="M6 4l10 6-10 6V4z" />
//                                         </svg>
//                                     </div>
//                                 )}
//                             </div>
//                             <span className="font-medium text-md text-gray-600 dark:text-gray-300">
//                                 Preview this course
//                             </span>
//                         </div>

//                         {/* Tabs */}
//                         <div className="flex gap-4 border-b dark:border-gray-700">
//                             <button className="py-2 px-4 font-semibold border-b-2 border-purple-700 text-purple-700 dark:text-purple-400">
//                                 Personal
//                             </button>
//                             <button className="py-2 px-4 font-semibold text-gray-500 dark:text-gray-400">
//                                 Teams
//                             </button>
//                         </div>

//                         {/* Subscription Info */}
//                         <div className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 mt-2">
//                             <span className="mt-1">&#9888;</span>
//                             <span>
//                                 This Premium course is included in plans <br />
//                                 <strong>
//                                     Subscribe to Edusathi’s top courses{" "}
//                                 </strong>
//                                 <br />
//                                 Get this course, plus 26,000+ of our top-rated
//                                 courses, with Personal Plan.{" "}
//                                 <a
//                                     href="#"
//                                     className="text-blue-500 dark:text-blue-400 underline"
//                                 >
//                                     Learn more
//                                 </a>
//                             </span>
//                         </div>

//                         {/* Buttons */}
//                         <button className="w-full mt-4 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded text-lg transition">
//                             Start subscription
//                         </button>
//                         <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                             Starting at ₹500 per month
//                             <br />
//                             Cancel anytime
//                         </span>

//                         <div className="flex items-center my-2">
//                             <span className="flex-1 border-b dark:border-gray-700 border-gray-300"></span>
//                             <span className="px-2 text-gray-400">or</span>
//                             <span className="flex-1 border-b dark:border-gray-700 border-gray-300"></span>
//                         </div>

//                         {/* Pricing */}
//                         <div className="flex flex-col gap-2">
//                             <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
//                                 ₹{video.price.toLocaleString("en-IN")}
//                             </div>
//                             <button className="w-full py-3 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold rounded border border-purple-600 mt-2">
//                                 Add to cart
//                             </button>
//                             <button className="w-full py-3 bg-green-600 text-white font-bold rounded mt-2">
//                                 Buy now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoDetails;
// import Navbar from "@/components/layout/Navbar";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// interface VideoDetailsData {
//     id: string;
//     title: string;
//     subtitle: string;
//     creator: string;
//     creatorBio: string;
//     lastUpdated: string;
//     language: string;
//     subtitles: string[];
//     rating: number;
//     ratingsCount: number;
//     learnersCount: number;
//     price: number;
//     previewUrl?: string;
//     learnList: string[];
// }

// //  Mock video data
// const MOCK_VIDEOS: VideoDetailsData[] = [
//     {
//         id: "1",
//         title: "Artificial Intelligence Risk and Cyber Security Course 2025",
//         subtitle:
//             "Learn how to govern and secure Artificial Intelligence and Machine Learning systems",
//         creator: "Taimur Ijlal",
//         creatorBio: "Award-winning cybersecurity leader and instructor",
//         lastUpdated: "Jan 2025",
//         language: "English",
//         subtitles: ["English [Auto]", "Korean [Auto]", "Hindi [Auto]"],
//         rating: 4.4,
//         ratingsCount: 7876,
//         learnersCount: 20813,
//         price: 2359,
//         previewUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
//         learnList: [
//             "Artificial Intelligence and Machine Learning risks",
//             "Cyber-security risks of AI systems",
//             "How ChatGPT can help you in Cybersecurity",
//             "How to create an AI governance framework",
//             "How to implement controls in a ML model lifecycle",
//         ],
//     },
// ];

// const VideoDetails: React.FC = () => {
//     const { videoId } = useParams<{ videoId: string }>();
//     const [video, setVideo] = useState<VideoDetailsData | null>(null);

//     useEffect(() => {
//         const foundVideo = MOCK_VIDEOS.find((v) => v.id === videoId);
//         setVideo(foundVideo || MOCK_VIDEOS[0]);
//     }, [videoId]);

//     if (!video) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-red-400 dark:bg-black bg-white">
//                 Video not found.
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
//             <Navbar />
//             <div className="relative mt-20 py-12 px-4 md:px-8">
//                 <div className="flex flex-col lg:flex-row lg:gap-5 xl:gap-8 2xl:gap-10 xl:w-[80%] w-[90%] mx-auto">
//                     {/* LEFT CONTENT */}
//                     <div className="flex-1 lg:max-w-[70%]">
//                         {/* Title */}
//                         <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
//                             {video.title}
//                         </h1>
//                         <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
//                             {video.subtitle}
//                         </p>

//                         {/* Creator Info */}
//                         <div className="mt-6 text-gray-700 dark:text-gray-300 text-sm flex flex-wrap gap-2">
//                             <span>
//                                 Created by{" "}
//                                 <a
//                                     href="#"
//                                     className="text-blue-500 dark:text-blue-400 underline font-semibold"
//                                 >
//                                     {video.creator} | {video.creatorBio}
//                                 </a>
//                             </span>
//                         </div>

//                         {/* Meta Info */}
//                         <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm flex flex-wrap gap-4">
//                             <span>Last updated {video.lastUpdated}</span>
//                             <span>{video.language}</span>
//                             <span>{video.subtitles.join(", ")}</span>
//                         </div>

//                         {/* Stats Card */}
//                         <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded p-5">
//                             <div className="bg-purple-700 text-white text-xs font-semibold rounded-full px-3 py-1">
//                                 Premium
//                             </div>
//                             <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
//                                 Access this top-rated course, plus 26,000+ more
//                                 top-rated courses, with a Udemy plan.
//                                 <span className="text-blue-500 dark:text-blue-400 ml-2 font-medium cursor-pointer">
//                                     See Plans & Pricing
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="text-2xl font-semibold text-gray-900 dark:text-white">
//                                     {video.rating.toFixed(1)}
//                                 </div>
//                                 <div className="flex flex-col text-xs text-gray-700 dark:text-gray-300">
//                                     <span>{video.ratingsCount} ratings</span>
//                                     <span>{video.learnersCount} learners</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* What you'll learn */}
//                         <div className="mt-8 rounded p-6 border dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                             <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//                                 What you'll learn
//                             </h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
//                                 {video.learnList.map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className="flex items-start gap-2 text-gray-800 dark:text-gray-200"
//                                     >
//                                         <span className="mt-1 text-green-500 dark:text-green-400">
//                                             &#10003;
//                                         </span>
//                                         <span>{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT SIDEBAR */}
//                     <div className="mt-12 lg:mt-0 w-full lg:max-w-sm xl:max-w-md bg-white dark:bg-gray-900 text-black dark:text-white shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded p-6 md:p-8 flex flex-col gap-6">
//                         {/* Preview */}
//                         <div className="flex flex-col items-center">
//                             <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded mb-3 overflow-hidden">
//                                 {video.previewUrl ? (
//                                     <video
//                                         src={video.previewUrl}
//                                         controls
//                                         className="w-full h-full object-cover rounded"
//                                     />
//                                 ) : (
//                                     <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mt-8">
//                                         <svg
//                                             className="w-10 h-10 text-white"
//                                             fill="currentColor"
//                                             viewBox="0 0 20 20"
//                                         >
//                                             <path d="M6 4l10 6-10 6V4z" />
//                                         </svg>
//                                     </div>
//                                 )}
//                             </div>
//                             <span className="font-medium text-md text-gray-600 dark:text-gray-300">
//                                 Preview this course
//                             </span>
//                         </div>

//                         {/* Tabs */}
//                         <div className="flex gap-4 border-b dark:border-gray-700">
//                             <button className="py-2 px-4 font-semibold border-b-2 border-purple-700 text-purple-700 dark:text-purple-400">
//                                 Personal
//                             </button>
//                             <button className="py-2 px-4 font-semibold text-gray-500 dark:text-gray-400">
//                                 Teams
//                             </button>
//                         </div>

//                         {/* Subscription Info */}
//                         <div className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 mt-2">
//                             <span className="mt-1">&#9888;</span>
//                             <span>
//                                 This Premium course is included in plans <br />
//                                 <strong>
//                                     Subscribe to Edusathi’s top courses{" "}
//                                 </strong>
//                                 <br />
//                                 Get this course, plus 26,000+ of our top-rated
//                                 courses, with Personal Plan.{" "}
//                                 <a
//                                     href="#"
//                                     className="text-blue-500 dark:text-blue-400 underline"
//                                 >
//                                     Learn more
//                                 </a>
//                             </span>
//                         </div>

//                         {/* Buttons */}
//                         <button className="w-full mt-4 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded text-lg transition">
//                             Start subscription
//                         </button>
//                         <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                             Starting at ₹500 per month
//                             <br />
//                             Cancel anytime
//                         </span>

//                         <div className="flex items-center my-2">
//                             <span className="flex-1 border-b dark:border-gray-700 border-gray-300"></span>
//                             <span className="px-2 text-gray-400">or</span>
//                             <span className="flex-1 border-b dark:border-gray-700 border-gray-300"></span>
//                         </div>

//                         {/* Pricing */}
//                         <div className="flex flex-col gap-2">
//                             <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
//                                 ₹{video.price.toLocaleString("en-IN")}
//                             </div>
//                             <button className="w-full py-3 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold rounded border border-purple-600 mt-2">
//                                 Add to cart
//                             </button>
//                             <button className="w-full py-3 bg-green-600 text-white font-bold rounded mt-2">
//                                 Buy now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoDetails;

import Navbar from "@/components/layout/Navbar";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface VideoDetailsData {
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
    isPremium?: boolean;
    createdAt: string;
}

const VideoDetails: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // Get video data passed via state or fallback mock
    const video =
        (location.state as { video?: VideoDetailsData })?.video || null;

    if (!video) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 dark:bg-black bg-white">
                Video not found.
            </div>
        );
    }

    const handlePlay = () => {
        navigate(`/watch/${video._id}`, { state: { video } });
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
            <Navbar />
            <div className="relative mt-20 py-12 px-4 md:px-8">
                <div className="flex flex-col lg:flex-row lg:gap-5 xl:gap-8 2xl:gap-10 xl:w-[80%] w-[90%] mx-auto">
                    {/* LEFT SIDE */}
                    <div className="flex-1 lg:max-w-[70%]">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {video.title}
                        </h1>
                        <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
                            {video.description}
                        </p>

                        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                            Uploaded by{" "}
                            <span className="font-semibold">
                                {video.creator.firstName}{" "}
                                {video.creator.lastName}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Uploaded on{" "}
                            {new Date(video.createdAt).toLocaleDateString()}
                        </div>

                        <div className="mt-8 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded p-5">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Course Access
                            </h2>
                            {video.isPremium ? (
                                <p className="text-gray-700 dark:text-gray-300">
                                    This is a{" "}
                                    <span className="font-semibold text-purple-500">
                                        Premium
                                    </span>{" "}
                                    course. Subscribe to access all lessons.
                                </p>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300">
                                    This is a{" "}
                                    <span className="font-semibold text-green-500">
                                        Free
                                    </span>{" "}
                                    course. You can start learning instantly!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="mt-12 lg:mt-0 w-full lg:max-w-sm xl:max-w-md bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded p-6 md:p-8 flex flex-col gap-6">
                        <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                            <img
                                src={video.thumbnail || "/placeholder.jpg"}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {video.isPremium ? (
                            <button className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded text-lg transition">
                                Start Subscription
                            </button>
                        ) : (
                            <button
                                onClick={handlePlay}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-lg transition"
                            >
                                ▶ Play Video
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;
