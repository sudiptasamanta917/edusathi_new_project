import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { PublicAPI } from "@/Api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CartItem = {
    courseId: string;
    title: string;
    price: number;
    thumbnail: string;
    creator: string;
    addedAt: string;
};

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        try {
            setLoading(true);
            const savedCart = localStorage.getItem('studentCart');
            
            if (!savedCart) {
                setLoading(false);
                return;
            }

            const cartData = JSON.parse(savedCart);
            
            if (cartData.length === 0) {
                setLoading(false);
                return;
            }

            // Cart data is already in the correct format
            setCartItems(cartData);
        } catch (err) {
            console.error("Error loading cart items:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = (courseId: string) => {
        const updatedCart = cartItems.filter(item => item.courseId !== courseId);
        setCartItems(updatedCart);
        localStorage.setItem('studentCart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('studentCart');
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        
        navigate('/checkout', {
            state: {
                courses: cartItems,
                type: 'cart_checkout',
                total: getTotalPrice()
            }
        });
    };


    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => navigate('/student/course-purchase')}
                    variant="outline"
                    size="sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
                    </p>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Browse our course catalog to find something you'd like to learn
                    </p>
                    <Button
                        onClick={() => navigate('/student/course-purchase')}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Cart Items</h2>
                            <Button
                                onClick={clearCart}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>

                        {cartItems.map((item) => (
                            <Card key={item.courseId} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex gap-4 p-4">
                                        {/* Course Thumbnail */}
                                        <div 
                                            className="flex-shrink-0 cursor-pointer"
                                            onClick={() => navigate(`/course/${item.courseId}`)}
                                        >
                                            <img
                                                src={item.thumbnail || "/placeholder.jpg"}
                                                alt={item.title}
                                                className="w-24 h-16 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 
                                                className="text-lg font-semibold text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                                                onClick={() => navigate(`/course/${item.courseId}`)}
                                            >
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <span>By {item.creator}</span>
                                                <span>•</span>
                                                <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Price & Actions */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-right">
                                                {item.price > 0 ? (
                                                    <div className="text-lg font-bold text-purple-600">
                                                        ₹{item.price}
                                                    </div>
                                                ) : (
                                                    <div className="text-lg font-bold text-green-600">
                                                        Free
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() => removeFromCart(item.courseId)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>₹{getTotalPrice()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Discount</span>
                                        <span className="text-green-600">-₹0</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>₹{getTotalPrice()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
                                    disabled={cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </Button>

                                <div className="text-center">
                                    <Button
                                        onClick={() => navigate('/student/course-purchase')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>

                                {/* Cart Benefits */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-sm mb-2">What you get:</h4>
                                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• Lifetime access to all courses</li>
                                        <li>• Mobile and desktop access</li>
                                        <li>• Certificate of completion</li>
                                        <li>• 30-day money-back guarantee</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
