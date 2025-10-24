import React, { useState, useEffect } from "react";
import { Users, BookOpen, Eye, Edit, TrendingUp, Calendar } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CourseAPI } from "@/Api/api";
import Sidebar from "./Sidebar";

interface Course {
    _id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string;
    isPaid: boolean;
    price: number;
    enrollmentCount: number;
    totalEnrollments: number;
    createdAt: string;
    updatedAt: string;
    playlists: any[];
}

const CreatorMyCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            console.log("Fetching creator courses...");
            const res = await CourseAPI.getCourses();
            console.log("Course API response:", res);
            
            if (res.status && res.data?.courses) {
                console.log("Setting courses with enrollment count:", res.data.courses);
                setCourses(res.data.courses);
            } else {
                setError(res.error || res.message || "Failed to fetch courses");
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to fetch courses");
        } finally {
            setLoading(false);
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
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading courses...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                    <div className="text-center py-12">
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button onClick={fetchCourses}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            My Courses
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your courses and track student enrollments
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <BookOpen className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Courses
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {courses.length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Students
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {courses.reduce((total, course) => total + (course.enrollmentCount || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="h-8 w-8 text-purple-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Paid Courses
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {courses.filter(course => course.isPaid).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <BookOpen className="h-8 w-8 text-orange-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Free Courses
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {courses.filter(course => !course.isPaid).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Courses Grid */}
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No courses yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Start creating courses to build your educational content.
                            </p>
                            <Button>Create Your First Course</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Course Thumbnail */}
                                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail.startsWith('http') ? 
                                                    course.thumbnail : 
                                                    `/uploads/${course.thumbnail}`
                                                }
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <BookOpen className="h-16 w-16 text-white opacity-50" />
                                            </div>
                                        )}
                                        
                                        {/* Price Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={course.isPaid ? "default" : "secondary"}>
                                                {course.isPaid ? `₹${course.price}` : 'Free'}
                                            </Badge>
                                        </div>

                                        {/* Enrollment Count Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                <span className="text-xs font-medium">
                                                    {course.enrollmentCount || 0} students
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-semibold line-clamp-2">
                                                {course.title}
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Badge variant="outline">{course.subject}</Badge>
                                            <Badge variant="outline">Grade {course.grade}</Badge>
                                            <Badge variant="outline">{course.level}</Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                            {course.description}
                                        </p>

                                        {/* Course Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-green-600" />
                                                <span className="font-medium">{course.enrollmentCount || 0}</span>
                                                <span className="text-gray-500">enrolled</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">{course.playlists?.length || 0}</span>
                                                <span className="text-gray-500">playlists</span>
                                            </div>
                                        </div>

                                        {/* Creation Date */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <Calendar className="h-3 w-3" />
                                            <span>Created {formatDate(course.createdAt)}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatorMyCourses;
