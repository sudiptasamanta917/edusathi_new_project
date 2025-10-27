import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import {
    Card,
    CardHeader,
    CardContent,
} from "../../components/ui/card";
import { DollarSign, BarChart3 } from "lucide-react";
import { Button } from "../../components/ui/button";

// Placeholder chart (you can integrate react-chartjs-2 once backend APIs are ready)
interface RevenueData {
    date: string;
    amount: number;
}

const Monetization: React.FC = () => {
    const [revenue, setRevenue] = useState<number>(0);
    const [monthlyEstimate, setMonthlyEstimate] = useState<number>(0);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

    useEffect(() => {
        // TODO: Replace with backend API
        setRevenue(1250.75);
        setMonthlyEstimate(320.5);
        setRevenueData([
            { date: "Sep 1", amount: 40 },
            { date: "Sep 5", amount: 65 },
            { date: "Sep 10", amount: 90 },
            { date: "Sep 15", amount: 120 },
            { date: "Sep 20", amount: 150 },
            { date: "Sep 25", amount: 200 },
        ]);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#282828] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">Monetization</h1>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4 shadow bg-[#1f1f1f]">
                        <CardHeader className="flex justify-between items-center">
                            <div>Total Revenue</div>
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ${revenue.toFixed(2)}
                            </p>
                            <p className="text-sm text-white">
                                All-time earnings
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="p-4 shadow bg-[#1f1f1f]">
                        <CardHeader className="flex justify-between items-center">
                            <div>Monthly Estimate</div>
                            <BarChart3 className="w-6 h-6 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ${monthlyEstimate.toFixed(2)}
                            </p>
                            <p className="text-sm text-white">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="p-4 shadow bg-[#1f1f1f]">
                        <CardHeader>
                            <div>Engagement Earnings</div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-1 text-sm">
                                <li className="flex justify-between">
                                    <span>Ads</span> <span>$420.10</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Subscriptions</span>{" "}
                                    <span>$310.50</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Course Sales</span>{" "}
                                    <span>$520.15</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Trend */}
                <Card className="p-4 shadow bg-[#1f1f1f] mb-6">
                    <CardHeader>
                        <div>Revenue Trend</div>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder: Replace with Line Chart later */}
                        <div className="h-40 flex items-center justify-center text-white text-sm">
                            Line Chart (Revenue over time)
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdown Table */}
                <Card className="p-4 shadow bg-[#1f1f1f]">
                    <CardHeader>
                        <div>Revenue Breakdown</div>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Source</th>
                                    <th className="p-2">Earnings</th>
                                    <th className="p-2">Share (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-2">Ads</td>
                                    <td className="p-2">$420.10</td>
                                    <td className="p-2">34%</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2">Subscriptions</td>
                                    <td className="p-2">$310.50</td>
                                    <td className="p-2">25%</td>
                                </tr>
                                <tr>
                                    <td className="p-2">Course Sales</td>
                                    <td className="p-2">$520.15</td>
                                    <td className="p-2">41%</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Monetization;
