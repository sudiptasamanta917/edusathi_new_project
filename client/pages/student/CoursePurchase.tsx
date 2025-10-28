import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ShoppingCart, Star, Clock, BookOpen, User, Play } from "lucide-react";
import { PublicAPI, StudentAPI } from "@/Api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Course = {
    _id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string;
    isPaid: boolean;
    price: number;
    creator: {
        _id: string;
        name: string;
        email: string;
    };
    playlistCount: number;
    createdAt: string;
    updatedAt: string;
};

export default function CoursePurchase() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [cart, setCart] = useState<string[]>([]);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Get unique subjects for filter
    const subjects = Array.from(new Set(courses.map(course => course.subject))).filter(Boolean);

    // Filter courses based on search and filter criteria
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (course.creator?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = selectedFilter === "all" ||
                            (selectedFilter === "free" && !course.isPaid) ||
                            (selectedFilter === "paid" && course.isPaid);

        const matchesSubject = selectedSubject === "all" || course.subject === selectedSubject;

        return matchesSearch && matchesFilter && matchesSubject;
    });

    useEffect(() => {
        fetchCourses();
        loadCart();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await PublicAPI.getAllCourses();
            
            if (data.status && data.data?.courses) {
                setCourses(data.data.courses);
            } else {
                console.error("Failed to load courses:", data.error || data.message);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadCart = () => {
        const savedCart = localStorage.getItem('studentCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    const addToCart = (courseId: string) => {
        const newCart = [...cart, courseId];
        setCart(newCart);
        localStorage.setItem('studentCart', JSON.stringify(newCart));
    };

    const removeFromCart = (courseId: string) => {
        const newCart = cart.filter(id => id !== courseId);
        setCart(newCart);
        localStorage.setItem('studentCart', JSON.stringify(newCart));
    };

    const isInCart = (courseId: string) => cart.includes(courseId);

    const handleCourseClick = (course: Course) => {
        navigate(`/course/${course._id}`, { state: { course } });
    };

    const handleBuyNow = async (course: Course) => {
        if (course.isPaid) {
            navigate('/checkout', { 
                state: { 
                    course: course,
                    type: 'course_purchase'
                }
            });
        } else {
            // For free courses, enroll via API and navigate to course
            try {
                const response = await StudentAPI.enrollFreeCourse(course._id);
                
                if (response.success) {
                    toast({
                        title: "Enrollment Successful! 🎉",
                        description: response.message || "You have been enrolled in this free course.",
                        variant: "default",
                    });
                    // Navigate to course detail page after a short delay
                    setTimeout(() => {
                        navigate(`/course/${course._id}`, { state: { course } });
                    }, 500);
                } else {
                    throw new Error(response.message || 'Enrollment failed');
                }
            } catch (error: any) {
                console.error('Enrollment error:', error);
                const errorMessage = error.message || 'Failed to enroll in course. Please try again.';
                
                // Check if already enrolled
                if (errorMessage.includes('already enrolled')) {
                    toast({
                        title: "Already Enrolled",
                        description: "You are already enrolled in this course. Redirecting...",
                        variant: "default",
                    });
                    setTimeout(() => {
                        navigate(`/course/${course._id}`, { state: { course } });
                    }, 1000);
                } else {
                    toast({
                        title: "Enrollment Failed",
                        description: errorMessage,
                        variant: "destructive",
                    });
                }
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Course Marketplace
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Discover and purchase courses from top creators ({courses.length} available)
                    </p>
                </div>
                
                {cart.length > 0 && (
                    <Button 
                        onClick={() => navigate('/student/cart')}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Cart ({cart.length})
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Price Filter */}
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            <option value="all">All Courses</option>
                            <option value="free">Free Courses</option>
                            <option value="paid">Paid Courses</option>
                        </select>

                        {/* Subject Filter */}
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            <option value="all">All Subjects</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>

                        {/* Results Count */}
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Filter className="w-4 h-4 mr-2" />
                            {filteredCourses.length} results
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm || selectedFilter !== 'all' || selectedSubject !== 'all'
                            ? "No courses found matching your criteria"
                            : "No courses available"
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course._id} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                            <div onClick={() => handleCourseClick(course)}>
                                {/* Course Thumbnail */}
                                <div className="relative">
                                    <img
                                        src={course.thumbnail || "/placeholder.jpg"}
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-3 right-3">
                                        {course.isPaid ? (
                                            <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-semibold">
                                                ₹{course.price}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-t-lg flex items-center justify-center">
                                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div onClick={() => handleCourseClick(course)} className="cursor-pointer">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Course Meta */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span>{course.creator?.name || 'Unknown Creator'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            <span>{course.playlistCount} playlists</span>
                                        </div>
                                    </div>

                                    {/* Course Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                            {course.subject}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                            Grade {course.grade}
                                        </span>
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4">
                                    {course.isPaid ? (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isInCart(course._id)) {
                                                        removeFromCart(course._id);
                                                    } else {
                                                        addToCart(course._id);
                                                    }
                                                }}
                                                variant={isInCart(course._id) ? "destructive" : "outline"}
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-1" />
                                                {isInCart(course._id) ? 'Remove' : 'Add to Cart'}
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuyNow(course);
                                                }}
                                                size="sm"
                                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                            >
                                                Buy Now
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuyNow(course);
                                            }}
                                            size="sm"
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Enroll Free
                                        </Button>
                                    )}
                                </div>

                                {/* Course Footer */}
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t">
                                    <span>Created {formatDate(course.createdAt)}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500" />
                                        <span>4.7</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
