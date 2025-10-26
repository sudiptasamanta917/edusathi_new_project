import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentAPI } from "@/Api/api";
import { BookOpen, Clock, GraduationCap, PlayCircle, TrendingUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EnrolledCourse {
    enrollmentId: string;
    courseId: string;
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    duration?: number;
    level?: string;
    subject?: string;
    grade?: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt?: string;
    creator?: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
    };
    playlists?: any[];
    isPublished?: boolean;
}

export default function EnrolledCourses() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    const loadEnrolledCourses = useCallback(async () => {
        try {
            const response = await StudentAPI.getEnrolledCourses();
            if (response?.success && response?.courses) {
                setCourses(response.courses);
            }
        } catch (error) {
            console.error("Failed to load enrolled courses:", error);
            toast.error("Failed to load your courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEnrolledCourses();
    }, [loadEnrolledCourses]);

    // Refetch when window regains focus (user comes back from watch page)
    useEffect(() => {
        const handleFocus = () => {
            loadEnrolledCourses();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadEnrolledCourses]);

    const handleContinueLearning = (courseId: string) => {
        navigate(`/course/${courseId}/watch`);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadEnrolledCourses();
        setRefreshing(false);
        toast.success("Progress updated!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">Loading your enrolled courses...</p>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <GraduationCap className="w-20 h-20 mx-auto text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    No Enrolled Courses Yet
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Start your learning journey by exploring and purchasing courses from our catalog.
                </p>
                <Button onClick={() => navigate("/catalog")} className="bg-blue-600 hover:bg-blue-700">
                    Browse Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        My Enrolled Courses
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Continue learning from where you left off ({courses.length} {courses.length === 1 ? 'course' : 'courses'})
                    </p>
                </div>
                <Button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className="gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Progress'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card 
                        key={course.enrollmentId} 
                        className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-800">
                            {course.thumbnail ? (
                                <img 
                                    src={course.thumbnail} 
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-slate-400" />
                                </div>
                            )}
                            
                            {/* Progress Badge */}
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {course.progress}%
                                </span>
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {course.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {course.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Course Info */}
                            <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                                {course.level && (
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                        {course.level}
                                    </span>
                                )}
                                {course.duration && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {course.duration}h
                                    </span>
                                )}
                            </div>

                            {/* Creator Info */}
                            {course.creator && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                        {course.creator.name?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                    <span>{course.creator.name}</span>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                    <span>Progress</span>
                                    <span>{course.progress}% Complete</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button 
                                onClick={() => handleContinueLearning(course.courseId)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
