import Navbar from "@/components/layout/Navbar";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StudentAPI } from "@/Api/api";

interface VideoDetailsData {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    course: {
        _id: string;
        title: string;
        isPaid: boolean;
        price: number;
    }
    creator: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    createdAt: string;
    language: string;
    subtitles: string[];
    isPremium?: boolean;
    rating: number;
    ratingsCount: number;
    learnersCount: number;
    price: number;
    previewUrl?: string;
    learnList: string[];
}

const VideoDetails: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
   

    // Get video data passed via state or fallback mock
    const video = (location.state as { video?: VideoDetailsData })?.video || null;

    console.log("Video Details:", video);

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

    const handleBuy = async () => {
        try {
            const token =
                sessionStorage.getItem("access_token") ||
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("accessToken") ||
                localStorage.getItem("accessToken");
            const role =
                localStorage.getItem("userRole") ||
                sessionStorage.getItem("userRole");

            if (!token || (role && role !== "student")) {
                navigate("/auth?role=student");
                return;
            }

            const order = await StudentAPI.createOrder([{ contentId: video._id }]);
            if (!order?.success || !order?.order?.id) {
                throw new Error("Failed to create order");
            }

            const options: any = {
                key: order.key_id,
                amount: order.order.amount,
                currency: order.order.currency,
                name: "Edusathi",
                description: video.title,
                order_id: order.order.id,
                handler: async function (response: any) {
                    try {
                        const verification = await StudentAPI.verify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: order.serverOrderId,
                        });
                        if (verification?.success) {
                            alert("Payment successful! Redirecting to My Courses...");
                            navigate("/my-courses", { replace: true });
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (e) {
                        console.error("Payment verification error:", e);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment modal closed");
                    },
                },
                theme: { color: "#3B82F6" },
            };

            const startCheckout = () => {
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            };

            if (!(window as any).Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = startCheckout;
                document.body.appendChild(script);
            } else {
                startCheckout();
            }
        } catch (error) {
            console.error("Payment init error:", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
            <Navbar />
            <div className="relative mt-20 py-12 px-4 md:px-8">
                <div className="flex flex-col lg:flex-row lg:gap-5 xl:gap-8 2xl:gap-10 xl:w-[80%] w-[90%] mx-auto">
                    {/* LEFT CONTENT */}
                    <div className="flex-1 lg:max-w-[70%]">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
                            {video.title}
                        </h1>
                        <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
                            {video.description}
                        </p>

                        {/* Creator Info */}
                        <div className="mt-6 text-gray-700 dark:text-gray-300 text-sm flex flex-wrap gap-2">
                            <span>
                                Created by{" "}
                                <a
                                    href="#"
                                    className="text-blue-500 dark:text-blue-400 underline font-semibold"
                                >
                                    {video.creator.firstName}{" "}
                                    {video.creator.lastName}
                                </a>
                            </span>
                        </div>

                        {/* Meta Info */}
                        <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm flex flex-wrap gap-4">
                            <span>
                                Uploaded on{" "}
                                {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                            <span>{video.language}</span>
                            <span>{video.subtitles}</span>
                        </div>

                        {/* Stats Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded p-5">
                            <div className="bg-purple-700 text-white text-xs font-semibold rounded-full px-3 py-1">
                                {video.isPremium ? "Premium" : "Free"}
                            </div>
                            <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                                Access this top-rated course, plus 26,000+ more
                                top-rated courses, with a Udemy plan.
                                <span className="text-green-600 ml-2 font-medium ">
                                    {video.isPremium
                                        ? "See Plans & Pricing"
                                        : "Watch Free Course"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {video.rating ? video.rating : "5.0"}
                                </div>
                                <div className="flex flex-col text-xs text-gray-700 dark:text-gray-300">
                                    <span>
                                        {video.ratingsCount
                                            ? `${video.ratingsCount} Ratings`
                                            : "Not Rated"}
                                    </span>
                                    <span>
                                        {video.learnersCount
                                            ? `${video.learnersCount} Users`
                                            : "No Subscribers"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="mt-8 rounded p-6 border dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                What you'll learn
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {video.learnList &&
                                video.learnList.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {video.learnList.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">
                                        Not Described
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="mt-12 lg:mt-0 w-full lg:max-w-sm xl:max-w-md bg-white dark:bg-gray-900 text-black dark:text-white shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded p-6 md:p-8 flex flex-col gap-6">
                        {/* Preview */}
                        <div className="flex flex-col items-center">
                            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded mb-3 overflow-hidden">
                                {video.previewUrl ? (
                                    <video
                                        src={video.previewUrl}
                                        controls
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mt-8">
                                        <svg
                                            className="w-10 h-10 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M6 4l10 6-10 6V4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className="font-medium text-md text-gray-600 dark:text-gray-300">
                                Preview this course
                            </span>
                        </div>

                        {video.isPremium ? (
                            <button
                                onClick={handleBuy}
                                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded text-lg transition"
                            >
                                Buy Now
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
