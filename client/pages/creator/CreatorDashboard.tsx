import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Star, Upload } from "lucide-react";
import Sidebar from "./Sidebar";
import VideoGrid from "@/components/home/sections/VideoGrid";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "../../components/ui/avatar";
import { useAuth } from "../../src/contexts/AuthContext";

interface Review {
    name: string;
    review: string;
    rating: number;
}

interface Subscriber {
    name: string;
    age: number;
}

interface Analytics {
    subscribers: number;
    views: number;
    watchTime: number; // hours
}

export default function CreatorDashboard() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Initial placeholder states for frontend
    const [reviews, setReviews] = useState<Review[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({
        subscribers: 0,
        views: 0,
        watchTime: 0,
    });

    // Initials for avatar fallback
    const initials = (user?.name || user?.email || "C")
        .slice(0, 1)
        .toUpperCase();

    // Simulate API fetch on component mount
    useEffect(() => {
        // TODO: Replace with API calls
        setReviews([
            {
                name: "Ananya Sharma",
                review: "The lessons were clear and well explained. Really helpful!",
                rating: 5,
            },
            {
                name: "Rahul Mehta",
                review: "Good content, but I wish there were more practice questions.",
                rating: 4,
            },
            {
                name: "Priya Das",
                review: "Amazing notes and very engaging teaching style.",
                rating: 4,
            },
        ]);

        setSubscribers([
            { name: "Sudipta Samanta", age: 13 },
            { name: "Subham", age: 20 },
            { name: "Sujay Pradhan", age: 18 },
        ]);

        setAnalytics({
            subscribers: 79,
            views: 0,
            watchTime: 0,
        });
    }, []);

    return (
        <div className="flex min-h-screen bg-[#282828] text-white">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-white">Creator Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload section */}
                    <Card className="bg-[#282828] text-white">
                        <CardContent className="flex flex-col items-center justify-center h-64">
                            <Upload className="w-16 h-16 text-blue-400 mb-4" />
                            <p className="text-center text-gray-300 mb-3">
                                Upload and publish a video.
                            </p>
                            <Button
                                onClick={() =>
                                    navigate("/dashboard/creator/contents")
                                }
                            >
                                Upload Videos
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Channel Analytics */}
                    <Card className="bg-[#282828] text-white">
                        <CardHeader>
                            <div className="text-white font-semibold text-lg">
                                Analytics
                            </div>
                            <CardDescription>
                                Current subscribers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-3xl font-bold mb-2">
                                {analytics.subscribers}
                            </h2>
                            <p className="text-sm text-gray-400 mb-3">
                                Last 28 days
                            </p>
                            <div className="space-y-1 text-sm">
                                <p>Views: {analytics.views}</p>
                                <p>Watch time (hours): {analytics.watchTime}</p>
                            </div>
                            <Button
                                className="mt-4 w-full"
                                onClick={() =>
                                    navigate("/dashboard/creator/analytics")
                                }
                            >
                                Go to analytics page
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reviews & Ratings */}
                    <Card className="bg-[#282828] text-white">
                        <CardHeader>
                            <div className="text-white font-semibold text-lg">
                                Student&apos;s Reviews & Ratings
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {reviews.map((r, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="" alt={r.name} />
                                        <AvatarFallback>
                                            {r.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {r.name}
                                        </p>
                                        <div className="flex items-center text-yellow-400 mb-1">
                                            {Array.from({ length: 5 }).map(
                                                (_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        className={`h-4 w-4 ${
                                                            idx < r.rating
                                                                ? "fill-yellow-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            {r.review}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <Button className="w-full mt-2">
                                See All Reviews
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Subscribers */}
                    <Card className="bg-[#282828] text-white">
                        <CardHeader>
                            <div className="text-white font-semibold text-lg">
                                Recent Subscribers
                            </div>
                            <CardDescription>Lifetime</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {subscribers.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {s.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm">{s.name}</p>
                                        <p className="text-xs text-gray-400">
                                            Age {s.age} Years
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Button className="mt-2 w-full">See All</Button>
                        </CardContent>
                    </Card>

                    {/* What's New */}
                    <Card className="bg-[#282828] text-white">
                        <CardHeader>
                            <div className="text-white font-semibold text-lg">
                                What's New in EduSathi
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2 text-gray-300">
                            <p>• Increasing Student's engagement</p>
                            <p>
                                • Personalized study plans based on student
                                progress
                            </p>
                            <p>• Faster and more secure login system</p>
                            <p>
                                • Expanded course library across multiple
                                subjects
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <VideoGrid
                    title="All Courses"
                    apiEndpoint={`${import.meta.env.VITE_SERVER_URL}/api/creator/all-videos`}
                    videosPerRow={5}
                    rowsBeforeShowAll={2}
                    showFilters
                    enableSearch
                />
            </main>
        </div>
    );
}
