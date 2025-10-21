// File: Checkout.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StudentAPI } from "@/Api/api";

type CartItem = {
    id: number;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
    courseId?: string;
};

const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [promo, setPromo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Prefer courses passed from Cart.tsx via navigate state
        const stateCourses = (location.state as any)?.courses as any[] | undefined;
        if (Array.isArray(stateCourses) && stateCourses.length) {
            const items: CartItem[] = stateCourses.map((c, idx) => ({
                id: idx + 1,
                name: c.title,
                variant: c.creator || "",
                price: Number(c.price) || 0,
                quantity: 1,
                image: c.thumbnail || "https://via.placeholder.com/64x64.png?text=Course",
                courseId: c.courseId,
            }));
            setCart(items);
            return;
        }

        // Fallback: load from localStorage 'studentCart'
        try {
            const saved = localStorage.getItem('studentCart');
            if (saved) {
                const parsed = JSON.parse(saved);
                const items: CartItem[] = (parsed || []).map((c: any, idx: number) => ({
                    id: idx + 1,
                    name: c.title,
                    variant: c.creator || "",
                    price: Number(c.price) || 0,
                    quantity: 1,
                    image: c.thumbnail || "https://via.placeholder.com/64x64.png?text=Course",
                    courseId: c.courseId,
                }));
                setCart(items);
            }
        } catch (e) {
            console.error('Failed to load cart for checkout', e);
        }
    }, [location.state]);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = 0;
    const total = subtotal + shipping;

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

            if (!token || role !== 'student') {
                navigate('/auth?role=student');
                return;
            }

            const courses = cart
                .map(ci => ci.courseId)
                .filter((id): id is string => typeof id === 'string' && id.length > 0)
                .map(id => ({ courseId: id }));

            if (!courses.length) {
                alert('No valid courses in cart to purchase.');
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
                            try { localStorage.removeItem('studentCart'); } catch {}
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
                modal: { ondismiss: function () { console.log("Payment modal closed"); } },
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
            console.error('Checkout payment init error', err);
            alert('Failed to initiate payment. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col lg:flex-row overflow-hidden">
                {/* Steps Column */}
                <div className="flex-1 p-8 space-y-6 border-r border-gray-200 dark:border-gray-700">
                    {/* Express Checkout */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Express Checkout
                        </h3>
                        <button className="bg-blue-700 w-full rounded py-3 text-white font-bold text-lg mb-2 hover:bg-blue-800 transition">
                            PayPal
                        </button>
                    </div>
                    {/* Email Step */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="font-bold text-lg mr-2">1</span>
                            <span className="font-semibold">
                                Enter Your Email
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            New customers can receive{" "}
                            <span className="font-semibold">10% off</span> their
                            first order. Already have an account? You'll be
                            prompted to log in.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address*"
                            />
                            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 p-2 rounded">
                                &#8594;
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            By providing your email, you agree to our{" "}
                            <a href="#" className="underline">
                                Privacy Policy
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline">
                                Terms of Service
                            </a>
                            .
                        </p>
                    </div>
                    {/* Shipping */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="font-bold text-lg mr-2">2</span>
                            <span className="font-semibold">Shipping</span>
                        </div>
                        {/* Add address form fields if needed */}
                    </div>
                    {/* Payment Method */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="font-bold text-lg mr-2">3</span>
                            <span className="font-semibold">
                                Payment Method
                            </span>
                        </div>
                    </div>
                    {/* Summary */}
                    <div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Estimated Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300 mt-3 flex gap-1 items-center">
                            <span>🇺🇸</span>
                            Final Tax and Shipping calculated after shipping
                            step is complete.
                        </div>
                    </div>
                    {/* Save Your Info */}
                    <div className="mt-2">
                        <div className="font-semibold text-sm mb-1">
                            Save Your Info (Optional)
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                            Create a password for easy order review and faster
                            checkout the next time you shop.
                        </div>
                        <div className="relative flex items-center">
                            <input
                                className="w-full border rounded p-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 text-sm"
                                placeholder="Choose Password (must be 8 characters)"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                minLength={8}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3 text-xl text-gray-500 dark:text-gray-300"
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                tabIndex={-1}
                            >
                                {showPassword ? "" : ""}
                            </button>
                        </div>
                    </div>
                    {/* Place Order Button */}
                    <button onClick={handlePlaceOrder} className="w-full mt-3 bg-gray-700 dark:bg-gray-900 text-white rounded py-3 font-bold text-base">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
