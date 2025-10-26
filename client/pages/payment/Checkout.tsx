import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StudentAPI } from "@/Api/api";
import { toast } from "sonner";


type Creator = {
    _id?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
    bio?: string;
    totalStudents?: number;
    totalCourses?: number;
    rating?: number;
};

type CartItem = {
    id: number;
    name: string;
    variant: string; // creator name
    price: number;
    quantity: number;
    image: string;
    courseId?: string;
};

const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Load cart data (state, single course, or localStorage)
    useEffect(() => {
        const stateCourses = (location.state as any)?.courses as
            | any[]
            | undefined;

        if (Array.isArray(stateCourses) && stateCourses.length) {
            const items: CartItem[] = stateCourses.map((c, idx) => {
                // Handle both object and string creator
                let creatorName = "Unknown Creator";
                if (typeof c.creator === 'string') {
                    creatorName = c.creator;
                } else if (c.creator && typeof c.creator === 'object' && c.creator.name) {
                    creatorName = c.creator.name;
                }
                
                return {
                    id: idx + 1,
                    name: c.title,
                    variant: creatorName,
                    price: Number(c.price) || 0,
                    quantity: 1,
                    image: c.thumbnail || "/class5.avif",
                    courseId: c._id || c.courseId,
                };
            });
            setCart(items);
            return;
        }

        const stateCourse = (location.state as any)?.course;
        if (stateCourse) {
            // Handle both object and string creator
            let creatorName = "Unknown Creator";
            if (typeof stateCourse.creator === 'string') {
                creatorName = stateCourse.creator;
            } else if (stateCourse.creator && typeof stateCourse.creator === 'object' && stateCourse.creator.name) {
                creatorName = stateCourse.creator.name;
            }
            
            const item: CartItem = {
                id: 1,
                name: stateCourse.title,
                variant: creatorName,
                price: Number(stateCourse.price) || 0,
                quantity: 1,
                image: stateCourse.thumbnail || "/class5.avif",
                courseId: stateCourse._id,
            };
            setCart([item]);
            return;
        }

        // ✅ Fallback: load from localStorage
        try {
            const saved = localStorage.getItem("studentCart");
            if (saved) {
                const parsed = JSON.parse(saved);
                const items: CartItem[] = (parsed || []).map(
                    (c: any, idx: number) => {
                        // Handle both object and string creator
                        let creatorName = "Unknown Creator";
                        if (typeof c.creator === 'string') {
                            creatorName = c.creator;
                        } else if (c.creator && typeof c.creator === 'object' && c.creator.name) {
                            creatorName = c.creator.name;
                        }
                        
                        return {
                            id: idx + 1,
                            name: c.title,
                            variant: creatorName,
                            price: Number(c.price) || 0,
                            quantity: 1,
                            image: c.thumbnail || "/class5.avif",
                            courseId: c.courseId,
                        };
                    }
                );
                setCart(items);
            }
        } catch (e) {
            console.error("Failed to load cart for checkout", e);
        }
    }, [location.state]);

    //  Load user info from storage
    useEffect(() => {
        const storedProfile =
            sessionStorage.getItem("userProfile") ||
            localStorage.getItem("userProfile") ||
            sessionStorage.getItem("user") ||
            localStorage.getItem("user");

        if (storedProfile) {
            try {
                const user = JSON.parse(storedProfile);
                setName(user.name || "");
                setEmail(user.email || "");
            } catch (error) {
                console.error("Failed to parse user profile", error);
            }
        }
    }, []);

    //  Calculate totals
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const total = subtotal;

    //  Razorpay payment handler
    const handlePlaceOrder = async () => {
        try {
            if (!cart.length) return;

            const token =
                sessionStorage.getItem("access_token") ||
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("accessToken") ||
                localStorage.getItem("accessToken");
            const role =
                localStorage.getItem("userRole") ||
                sessionStorage.getItem("userRole");

            if (!token || role !== "student") {
                navigate("/auth?role=student");
                return;
            }

            const courses = cart
                .map((ci) => ci.courseId)
                .filter(
                    (id): id is string =>
                        typeof id === "string" && id.length > 0
                )
                .map((id) => ({ courseId: id }));

            if (!courses.length) {
                toast.error("No valid courses in cart to purchase.");
                return;
            }

            const order = await StudentAPI.courseCreateOrder(courses);
            if (!order?.success || !order?.order?.id) {
                throw new Error("Failed to create order");
            }

            const options: any = {
                key: order.key_id,
                amount: order.order.amount,
                currency: order.order.currency,
                name: "Edusathi",
                description: `Course purchase (${courses.length})`,
                order_id: order.order.id,
                handler: async function (response: any) {
                    try {
                        const verification = await StudentAPI.courseVerify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: order.serverOrderId,
                        });
                        if (verification?.success) {
                            // Clear purchased cart
                            try {
                                localStorage.removeItem("studentCart");
                            } catch {}
                            
                            // Show success message
                            toast.success(
                                "Payment successful! You are now enrolled in the course(s)."
                            );
                            
                            // Redirect to student dashboard with enrolled courses tab
                            setTimeout(() => {
                                navigate("/student", { 
                                    replace: true,
                                    state: { 
                                        activeTab: 'enrolled-courses',
                                        message: `Successfully enrolled in ${verification.enrolledCount || courses.length} course(s)!`
                                    }
                                });
                            }, 1500);
                        } else {
                            toast.error(
                                "Payment verification failed. Please contact support."
                            );
                        }
                    } catch (e) {
                        console.error("Payment verification error:", e);
                        toast.error(
                            "Payment verification failed. Please contact support."
                        );
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
        } catch (err) {
            console.error("Checkout payment init error", err);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 p-8 space-y-6 border-r border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4">
                        Express Checkout
                    </h3>

                    {/*  User Info */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="font-semibold">User Name</span>
                        </div>
                        <p>{name || "Unknown User"}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="font-semibold">Your Email</span>
                        </div>
                        <p>{email || "No email found"}</p>
                    </div>

                    {/*  Cart Items */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Order Items ({cart.length})
                        </h4>
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 border dark:border-gray-600 p-4 rounded-lg items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <img
                                    src={item.image || "/class5.avif"}
                                    alt={item.name}
                                    className="w-24 h-16 object-cover rounded shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.src = "/class5.avif";
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        By {item.variant}
                                    </p>
                                </div>
                                <div className="font-bold text-lg text-purple-600 dark:text-purple-400">
                                    {item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : 'Free'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*  Summary */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
                        <div className="flex justify-between text-base py-2">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-base py-2">
                            <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                            <span className="font-semibold text-green-600">₹0</span>
                        </div>
                        <div className="flex justify-between py-3 font-bold text-xl border-t-2 border-purple-200 dark:border-purple-800 mt-2">
                            <span>Total Payable</span>
                            <span className="text-purple-600 dark:text-purple-400">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/*  Place Order Button */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg py-4 font-bold text-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        {cart.length === 0 ? 'No Items to Checkout' : `Place Order • ₹${total.toLocaleString('en-IN')}`}
                    </button>
                    
                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Secure checkout powered by Razorpay</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
