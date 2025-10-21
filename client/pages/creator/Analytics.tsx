import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import {
    Card,
    CardHeader,
    CardContent,
} from "../../components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface VideoAnalytics {
    id: number;
    title: string;
    views: number;
    likes: number;
    comments: number;
}

interface OverviewAnalytics {
    views: number;
    watchTime: number; // hours
    subscribers: number;
}

const Analytics: React.FC = () => {
    const [overview, setOverview] = useState<OverviewAnalytics>({
        views: 0,
        watchTime: 0,
        subscribers: 0,
    });
    const [topVideos, setTopVideos] = useState<VideoAnalytics[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        // TODO: replace with API calls

        // Overview
        setOverview({
            views: 1200,
            watchTime: 340, // hours
            subscribers: 150,
        });

        // Top videos
        setTopVideos([
            {
                id: 1,
                title: "Intro to React",
                views: 500,
                likes: 45,
                comments: 10,
            },
            {
                id: 2,
                title: "TypeScript Basics",
                views: 350,
                likes: 30,
                comments: 5,
            },
            {
                id: 3,
                title: "Tailwind Styling",
                views: 250,
                likes: 20,
                comments: 2,
            },
        ]);

        // Chart data: views per day for last 7 days
        setChartData([100, 150, 120, 200, 180, 220, 250]);
    }, []);

    const lineChartData = {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: [
            {
                label: "Views",
                data: chartData,
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6aa",
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="flex min-h-screen bg-[#282828] text-white">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

                {/* Overview Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-[#282828]">
                        <CardHeader>
                            <div>Views</div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {overview.views}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#282828]">
                        <CardHeader>
                            <div>Watch Time (hrs)</div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {overview.watchTime}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#282828]">
                        <CardHeader>
                            <div>Subscribers</div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {overview.subscribers}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Chart */}
                <Card className="bg-[#282828] mb-6">
                    <CardHeader>
                        <div>Views in Last 7 Days</div>
                    </CardHeader>
                    <CardContent>
                        <Line data={lineChartData} />
                    </CardContent>
                </Card>

                {/* Top Videos */}
                <Card className="bg-[#282828] mb-6">
                    <CardHeader>
                        <div>Top Videos</div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {topVideos.map((video) => (
                            <div
                                key={video.id}
                                className="flex justify-between p-2 bg-gray-800 rounded items-center"
                            >
                                <p className="font-medium">{video.title}</p>
                                <div className="flex gap-4 text-sm text-gray-300">
                                    <span>Views: {video.views}</span>
                                    <span>Likes: {video.likes}</span>
                                    <span>Comments: {video.comments}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Engagement Metrics (optional) */}
                <Card className="bg-[#282828]">
                    <CardHeader>
                        <div>Engagement</div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <p>
                            Likes:{" "}
                            {topVideos.reduce((acc, v) => acc + v.likes, 0)}
                        </p>
                        <p>
                            Comments:{" "}
                            {topVideos.reduce((acc, v) => acc + v.comments, 0)}
                        </p>
                        <p>Shares: {Math.floor(Math.random() * 50)}</p>{" "}
                        {/* Placeholder */}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default Analytics;
