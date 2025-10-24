// src/pages/creator/Payment.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, PlusCircle } from "lucide-react";
import Sidebar from "./Sidebar";

interface PaymentHistory {
    id: number;
    date: string;
    amount: string;
    status: "Completed" | "Pending" | "Failed";
}

const Payment: React.FC = () => {
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");

    // Dummy payment history (backend will replace via API)
    const [paymentHistory] = useState<PaymentHistory[]>([
        { id: 1, date: "2025-09-01", amount: "₹5,000", status: "Completed" },
        { id: 2, date: "2025-08-15", amount: "₹3,200", status: "Pending" },
        { id: 3, date: "2025-08-01", amount: "₹2,800", status: "Completed" },
    ]);

    const handleSaveBankDetails = () => {
        // 🔗 Send data to backend API
        console.log({
            bankName,
            accountNumber,
            ifsc,
        });
        alert("Bank details saved (API integration pending).");
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            <div className="p-6 flex-1 bg-[#282828] text-white space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    {/* <Banknote className="h-7 w-7 text-green-500" /> */}
                    <h1 className="text-2xl font-bold">Payment</h1>
                </div>

                {/* Bank Account Form */}
                <Card className="bg-[#1f1f1f] border border-gray-700 shadow-lg">
                    <CardContent className="p-6 space-y-5">
                        <h2 className="text-xl font-semibold text-white">
                            Bank Account Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="bankName"
                                    className="text-gray-300"
                                >
                                    Bank Name
                                </Label>
                                <Input
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) =>
                                        setBankName(e.target.value)
                                    }
                                    placeholder="Enter your bank name"
                                    className="bg-gray-800 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="accountNumber"
                                    className="text-gray-300"
                                >
                                    Account Number
                                </Label>
                                <Input
                                    id="accountNumber"
                                    value={accountNumber}
                                    onChange={(e) =>
                                        setAccountNumber(e.target.value)
                                    }
                                    placeholder="Enter account number"
                                    className="bg-gray-800 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="ifsc" className="text-gray-300">
                                    IFSC Code
                                </Label>
                                <Input
                                    id="ifsc"
                                    value={ifsc}
                                    onChange={(e) => setIfsc(e.target.value)}
                                    placeholder="Enter IFSC code"
                                    className="bg-gray-800 border-gray-600 text-white"
                                />
                            </div>
                            <Button
                                onClick={handleSaveBankDetails}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Save Bank Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment History */}
                <Card className="bg-[#1f1f1f] border border-gray-700 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                Payment History
                            </h2>
                            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                                <PlusCircle className="h-4 w-4" />
                                Request Payout
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-gray-300">
                                <thead>
                                    <tr className="text-left border-b border-gray-600">
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b border-gray-700 hover:bg-[#2a2a2a]"
                                        >
                                            <td className="p-3">
                                                {payment.date}
                                            </td>
                                            <td className="p-3">
                                                {payment.amount}
                                            </td>
                                            <td
                                                className={`p-3 font-medium ${
                                                    payment.status ===
                                                    "Completed"
                                                        ? "text-green-400"
                                                        : payment.status ===
                                                            "Pending"
                                                          ? "text-yellow-400"
                                                          : "text-red-400"
                                                }`}
                                            >
                                                {payment.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Payment;
