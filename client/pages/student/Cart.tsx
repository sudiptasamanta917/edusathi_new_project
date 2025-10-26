import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { PublicAPI, StudentAPI } from "@/Api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
    const [checkingEnrollment, setCheckingEnrollment] = useState(false);
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
            
            // Debug: Log cart items to check price types
            console.log('Cart items loaded:', cartData.map(item => ({ 
                title: item.title, 
                price: item.price, 
                priceType: typeof item.price 
            })));

            // Check which courses are already enrolled
            await checkEnrolledCourses(cartData);
        } catch (err) {
            console.error("Error loading cart items:", err);
            toast.error("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    const checkEnrolledCourses = async (cart: CartItem[]) => {
        try {
            setCheckingEnrollment(true);
            
            // Check if user is logged in as student
            const token = 
                sessionStorage.getItem('access_token') || 
                localStorage.getItem('access_token');
            
            const userRole = 
                sessionStorage.getItem('userRole') || 
                localStorage.getItem('userRole');
            
            if (!token || userRole !== 'student') {
                return;
            }

            // Check enrollment for each course in cart
            const enrolledIds = new Set<string>();
            
            for (const item of cart) {
                try {
                    const response = await StudentAPI.checkCourseAccess(item.courseId);
                    if (response?.hasAccess) {
                        enrolledIds.add(item.courseId);
                    }
                } catch (error) {
                    // Not enrolled - that's okay
                }
            }

            setEnrolledCourseIds(enrolledIds);

            // Show warning if any courses are already enrolled
            if (enrolledIds.size > 0) {
                toast.info(`${enrolledIds.size} course(s) in cart are already enrolled!`);
            }
        } catch (error) {
            console.error("Error checking enrollments:", error);
        } finally {
            setCheckingEnrollment(false);
        }
    };

    const removeFromCart = (courseId: string) => {
        const course = cartItems.find(item => item.courseId === courseId);
        const updatedCart = cartItems.filter(item => item.courseId !== courseId);
        setCartItems(updatedCart);
        localStorage.setItem('studentCart', JSON.stringify(updatedCart));
        
        // Remove from enrolled set if exists
        const newEnrolledIds = new Set(enrolledCourseIds);
        newEnrolledIds.delete(courseId);
        setEnrolledCourseIds(newEnrolledIds);
        
        toast.success(`${course?.title || 'Course'} removed from cart`);
    };

    const clearCart = () => {
        if (cartItems.length === 0) return;
        
        // Confirm before clearing
        if (window.confirm(`Are you sure you want to clear all ${cartItems.length} items from your cart?`)) {
            setCartItems([]);
            setEnrolledCourseIds(new Set());
            localStorage.removeItem('studentCart');
            toast.success('Cart cleared successfully');
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
            return total + price;
        }, 0);
    };

    const getPayableAmount = () => {
        // Calculate total excluding already enrolled courses
        return cartItems
            .filter(item => !enrolledCourseIds.has(item.courseId))
            .reduce((total, item) => {
                const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                return total + price;
            }, 0);
    };

    const getEnrolledCoursesTotal = () => {
        return cartItems
            .filter(item => enrolledCourseIds.has(item.courseId))
            .reduce((total, item) => {
                const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                return total + price;
            }, 0);
    };

    const getUnenrolledCount = () => {
        return cartItems.filter(item => !enrolledCourseIds.has(item.courseId)).length;
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        
        // Filter out enrolled courses
        const unenrolledCourses = cartItems.filter(item => !enrolledCourseIds.has(item.courseId));
        
        if (unenrolledCourses.length === 0) {
            toast.warning('All courses in cart are already enrolled!');
            return;
        }
        
        navigate('/checkout', {
            state: {
                courses: unenrolledCourses,
                type: 'cart_checkout',
                total: getPayableAmount()
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

                        {cartItems.map((item) => {
                            const isEnrolled = enrolledCourseIds.has(item.courseId);
                            const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                            
                            return (
                                <Card 
                                    key={item.courseId} 
                                    className={`overflow-hidden ${isEnrolled ? 'border-green-500 border-2' : ''}`}
                                >
                                    <CardContent className="p-0">
                                        {/* Enrolled Badge */}
                                        {isEnrolled && (
                                            <div className="bg-green-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Already Enrolled - Remove from cart or checkout anyway
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-4 p-4">
                                            {/* Course Thumbnail */}
                                            <div 
                                                className="flex-shrink-0 cursor-pointer relative"
                                                onClick={() => navigate(`/course/${item.courseId}`)}
                                            >
                                                <img
                                                    src={item.thumbnail || "/class5.avif"}
                                                    alt={item.title}
                                                    className="w-24 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/class5.avif";
                                                    }}
                                                />
                                                {isEnrolled && (
                                                    <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                                    </div>
                                                )}
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
                                                {isEnrolled && (
                                                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                        <AlertCircle className="w-3 h-3" />
                                                        You already have access to this course
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="flex flex-col items-end justify-between">
                                                <div className="text-right">
                                                    {itemPrice > 0 ? (
                                                        <div className="text-lg font-bold text-purple-600">
                                                            ₹{itemPrice}
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
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Enrolled Courses Warning */}
                                {enrolledCourseIds.size > 0 && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                                                    Notice
                                                </p>
                                                <p className="text-yellow-700 dark:text-yellow-300">
                                                    {enrolledCourseIds.size} course{enrolledCourseIds.size > 1 ? 's' : ''} already enrolled will not be charged again.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {/* Cart Items Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Total Items</span>
                                            <span>{cartItems.length} course{cartItems.length > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Cart Subtotal</span>
                                            <span>₹{getTotalPrice()}</span>
                                        </div>
                                    </div>

                                    {/* Already Enrolled Deduction */}
                                    {enrolledCourseIds.size > 0 && (
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Already Enrolled ({enrolledCourseIds.size})
                                                </span>
                                                <span className="text-green-700 dark:text-green-400 font-medium">
                                                    -₹{getEnrolledCoursesTotal()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-green-600 dark:text-green-300">
                                                These courses won't be charged
                                            </p>
                                        </div>
                                    )}

                                    {/* Discount Section (if any) */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Additional Discount</span>
                                        <span className="text-gray-600 dark:text-gray-400">₹0</span>
                                    </div>

                                    {/* Total Payable */}
                                    <div className="border-t-2 border-purple-200 dark:border-purple-800 pt-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-lg">Total Payable</p>
                                                {getUnenrolledCount() > 0 && (
                                                    <p className="text-xs text-gray-500">
                                                        For {getUnenrolledCount()} course{getUnenrolledCount() > 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-2xl text-purple-600">
                                                    ₹{getPayableAmount()}
                                                </p>
                                                {enrolledCourseIds.size > 0 && getPayableAmount() === 0 && (
                                                    <p className="text-xs text-green-600">
                                                        All enrolled!
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
                                    disabled={cartItems.length === 0 || (enrolledCourseIds.size > 0 && getUnenrolledCount() === 0)}
                                >
                                    {cartItems.length === 0 
                                        ? 'Cart is Empty' 
                                        : (enrolledCourseIds.size > 0 && getUnenrolledCount() === 0)
                                            ? 'All Courses Enrolled'
                                            : `Proceed to Checkout (${getUnenrolledCount()})`
                                    }
                                </Button>

                                {/* Show message if all enrolled */}
                                {enrolledCourseIds.size > 0 && getUnenrolledCount() === 0 && cartItems.length > 0 && (
                                    <p className="text-center text-sm text-green-600 dark:text-green-400">
                                        ✅ You're already enrolled in all cart items
                                    </p>
                                )}

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
