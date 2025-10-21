// File: Checkout.tsx
import React, { useState } from "react";

type CartItem = {
    id: number;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
};

const Checkout: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([
        {
            id: 1,
            name: "The Puff Sweater",
            variant: "Medium | Heathered Oat",
            price: 125,
            quantity: 1,
            image: "https://via.placeholder.com/64x64.png?text=Product",
        },
    ]);
    const [promo, setPromo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = 0;
    const total = subtotal + shipping;

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
                        {/* Add payment fields if needed */}
                    </div>
                </div>
                {/* Cart Summary Column */}
                <div className="w-full lg:w-96 p-8 flex-shrink-0 space-y-5">
                    {/* Cart header */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold flex items-center gap-1">
                            🛒 Cart ({cart.length})
                        </span>
                        <span className="font-bold">${subtotal}</span>
                    </div>
                    {/* Cart Item */}
                    <div className="flex gap-3 bg-gray-50 dark:bg-gray-900 rounded p-2 border dark:border-gray-700">
                        <img
                            className="w-16 h-16 rounded object-cover"
                            src={cart[0].image}
                            alt="Product"
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {cart[0].name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                                {cart[0].variant}
                            </div>
                            <div className="mt-1 text-gray-700 dark:text-gray-100">
                                ${cart[0].price}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="border p-1 px-2 rounded"
                                onClick={() =>
                                    setCart((cart) =>
                                        cart.map((item) =>
                                            item.id === cart[0].id
                                                ? {
                                                      ...item,
                                                      quantity: Math.max(
                                                          1,
                                                          item.quantity - 1
                                                      ),
                                                  }
                                                : item
                                        )
                                    )
                                }
                            >
                                -
                            </button>
                            <span className="mx-1">{cart[0].quantity}</span>
                            <button
                                className="border p-1 px-2 rounded"
                                onClick={() =>
                                    setCart((cart) =>
                                        cart.map((item) =>
                                            item.id === cart[0].id
                                                ? {
                                                      ...item,
                                                      quantity:
                                                          item.quantity + 1,
                                                  }
                                                : item
                                        )
                                    )
                                }
                            >
                                +
                            </button>
                        </div>
                    </div>
                    {/* Promo Code */}
                    <div className="flex gap-2">
                        <input
                            className="w-full border rounded p-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Gift or promo code"
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                        />
                        <button className="bg-gray-200 dark:bg-gray-700 rounded px-4 text-gray-600 dark:text-gray-200">
                            Apply
                        </button>
                    </div>
                    {/* Summary */}
                    <div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Estimated Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>${total}</span>
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
                    <button className="w-full mt-3 bg-gray-700 dark:bg-gray-900 text-white rounded py-3 font-bold text-base">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
