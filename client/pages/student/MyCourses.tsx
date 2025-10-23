import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentAPI } from "@/Api/api";
import { useNavigate } from "react-router-dom";
import { Play, Clock, User, BookOpen } from "lucide-react";
import { getCourseThumbnail } from "@/utils/imageUtils";

interface EnrolledCourse {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    isPaid: boolean;
    price: number;
    subject: string;
    grade: string;
    level: string;
    creator: {
        name: string;
        email: string;
        profilePicture?: string;
    };
    enrolledAt: string;
    paymentId?: string;
    progress: {
        percentage: number;
        completedVideos: number;
        totalVideos: number;
        lastAccessed?: string;
    };
}

export default function MyCourses() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StudentAPI.getMyEnrolledCoursesDetailed();
            
            if (response.success) {
                setCourses(response.courses);
            } else {
                setError('Failed to load enrolled courses');
            }
        } catch (err: any) {
            console.error('Error fetching enrolled courses:', err);
            setError(err.message || 'Failed to load enrolled courses');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId: string) => {
        navigate(`/course/${courseId}`);
    };

    const handleContinueLearning = (courseId: string) => {
        // Navigate to the course to continue learning
        navigate(`/course/${courseId}`);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-center text-gray-600">Loading your courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center text-red-600 mb-4">
                    <p>{error}</p>
                </div>
                <Button onClick={fetchEnrolledCourses} className="mx-auto block">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Enrolled Courses</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No enrolled courses yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Start learning by enrolling in courses that interest you.</p>
                    <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {courses.map((course) => (
                        <Card 
                            key={course._id} 
                            className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
                            onClick={() => handleCourseClick(course._id)}
                        >
                            {/* Thumbnail Section */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={getCourseThumbnail(course.thumbnail)}
                                    alt={course.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        console.log('Image load error for course:', course._id, 'thumbnail:', course.thumbnail);
                                        (e.target as HTMLImageElement).src = "/class5.avif";
                                    }}
                                />
                                
                                {/* Price Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.isPaid 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-blue-500 text-white'
                                    }`}>
                                        {course.isPaid ? `₹${course.price}` : 'Free'}
                                    </span>
                                </div>
                                
                                {/* Progress Badge */}
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                                        {course.progress.percentage}% Complete
                                    </span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Play className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-3 sm:p-4 flex-1 flex flex-col">
                                {/* Title and Creator */}
                                <div className="mb-2 sm:mb-3">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 leading-tight">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{course.creator?.name || 'Unknown Creator'}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                                    {course.description}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                                        {course.subject}
                                    </span>
                                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                                        Grade {course.grade}
                                    </span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                                        {course.level}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3 sm:mb-4">
                                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                                        <span className="font-medium">Progress</span>
                                        <span>{course.progress.completedVideos}/{course.progress.totalVideos} videos</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out" 
                                            style={{ width: `${course.progress.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Action Button - Pushed to bottom */}
                                <div className="mt-auto">
                                    <Button 
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 sm:py-2.5 text-sm transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContinueLearning(course._id);
                                        }}
                                    >
                                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Continue Learning</span>
                                        <span className="sm:hidden">Continue</span>
                                    </Button>

                                    {/* Enrollment Date */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-3 text-center">
                                        Enrolled {new Date(course.enrolledAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
