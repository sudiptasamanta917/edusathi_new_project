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
                const creator: Creator = c.creator || {};
                return {
                    id: idx + 1,
                    name: c.title,
                    variant: creator?.name || "Unknown Creator",
                    price: Number(c.price) || 0,
                    quantity: 1,
                    image: c.thumbnail || "/class.avif",
                    courseId: c._id || c.courseId,
                };
            });
            setCart(items);
            return;
        }

        const stateCourse = (location.state as any)?.course;
        if (stateCourse) {
            const creator: Creator = stateCourse.creator || {};
            const item: CartItem = {
                id: 1,
                name: stateCourse.title,
                variant: creator?.name || "Unknown Creator",
                price: Number(stateCourse.price) || 0,
                quantity: 1,
                image: stateCourse.thumbnail || "/class.avif",
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
                        const creator: Creator = c.creator || {};
                        return {
                            id: idx + 1,
                            name: c.title,
                            variant: creator?.name || "Unknown Creator",
                            price: Number(c.price) || 0,
                            quantity: 1,
                            image: c.thumbnail || "/class.avif",
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
                            toast.error(
                                "Payment successful! Redirecting to My Courses..."
                            );
                            navigate("/my-courses", { replace: true });
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
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 border p-3 rounded-lg items-center"
                            >
                                <img
                                    // src={item.image}
                                    src="/class5.avif"
                                    alt={item.name}
                                    className="w-20 h-14 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.variant}
                                    </p>
                                </div>
                                <div className="font-semibold">
                                    ₹{item.price}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*  Summary */}
                    <div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>

                    {/*  Place Order Button */}
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full mt-3 bg-gray-700 dark:bg-gray-900 text-white rounded py-3 font-bold text-base"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
