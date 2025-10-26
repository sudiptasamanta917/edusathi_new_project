import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentAPI, PublicAPI } from "@/Api/api";
import VideoPlayer from "../components/VideoPlayer";
import { ChevronDown, ChevronUp, PlayCircle, Lock, Check } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

interface Video {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl: string;
    duration?: number;
    order?: number;
}

interface Playlist {
    _id: string;
    title: string;
    description?: string;
    videos: Video[];
    order?: number;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    creator?: {
        name: string;
        email: string;
    };
    playlists: Playlist[];
}

export default function CourseWatch() {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [checkingAccess, setCheckingAccess] = useState(true);
    
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
    const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
    const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

    // Check course access
    useEffect(() => {
        if (!courseId) return;
        
        const checkAccess = async () => {
            try {
                console.log("Checking access for course:", courseId);
                const response = await StudentAPI.checkCourseAccess(courseId);
                console.log("Access check response:", response);
                
                if (response?.hasAccess) {
                    setHasAccess(true);
                    console.log("Access granted");
                    
                    // Load completed videos from enrollment
                    if (response.enrollment?.completedVideos) {
                        setCompletedVideos(new Set(response.enrollment.completedVideos));
                        console.log("Loaded completed videos:", response.enrollment.completedVideos);
                    }
                } else {
                    setHasAccess(false);
                    toast.error("You don't have access to this course");
                    console.log("Access denied - not enrolled");
                    setTimeout(() => navigate("/student/course-purchase"), 2000);
                }
            } catch (error) {
                console.error("Access check failed:", error);
                setHasAccess(false);
                toast.error("Please login and purchase this course");
                setTimeout(() => navigate(`/course/${courseId}`), 2000);
            } finally {
                setCheckingAccess(false);
            }
        };

        checkAccess();
    }, [courseId, navigate]);

    // Load course details
    useEffect(() => {
        if (!courseId) return;
        if (checkingAccess) return; // Wait for access check to complete
        
        if (!hasAccess) {
            setLoading(false);
            return;
        }

        const loadCourse = async () => {
            try {
                console.log("Loading course:", courseId);
                const response = await PublicAPI.getCourseById(courseId);
                console.log("Course API response:", response);
                
                // Response structure: { status, message, data: { course } }
                const courseData = response?.data?.course || response?.course;
                console.log("Extracted course data:", courseData);
                
                if (courseData) {
                    setCourse(courseData);
                    console.log("Course set successfully");
                    
                    // Expand first playlist and play first video
                    if (courseData.playlists && courseData.playlists.length > 0) {
                        const firstPlaylist = courseData.playlists[0];
                        console.log("First playlist:", firstPlaylist);
                        setExpandedPlaylists(new Set([firstPlaylist._id]));
                        
                        if (firstPlaylist.videos && firstPlaylist.videos.length > 0) {
                            setCurrentVideo(firstPlaylist.videos[0]);
                            setCurrentPlaylistId(firstPlaylist._id);
                            console.log("First video set:", firstPlaylist.videos[0]);
                        }
                    }
                } else {
                    console.error("No course data in response:", response);
                    toast.error("Course data not found");
                }
            } catch (error) {
                console.error("Failed to load course:", error);
                toast.error("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [courseId, hasAccess, checkingAccess]);

    const togglePlaylist = (playlistId: string) => {
        setExpandedPlaylists(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playlistId)) {
                newSet.delete(playlistId);
            } else {
                newSet.add(playlistId);
            }
            return newSet;
        });
    };

    const playVideo = (video: Video, playlistId: string) => {
        setCurrentVideo(video);
        setCurrentPlaylistId(playlistId);
    };

    const markVideoComplete = async (videoId: string) => {
        if (!courseId || completedVideos.has(videoId)) return;
        
        try {
            // Optimistically update UI
            setCompletedVideos(prev => new Set([...prev, videoId]));
            
            // Update progress in backend
            const response = await StudentAPI.updateCourseProgress(courseId, videoId);
            
            if (response?.success) {
                console.log("Progress updated:", response);
                toast.success(`Progress: ${response.progress}%`);
                
                // Update course progress if we have the enrollment data
                if (course) {
                    // Optionally refetch course to update progress display
                }
            }
        } catch (error) {
            console.error("Failed to update progress:", error);
            // Revert optimistic update on error
            setCompletedVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(videoId);
                return newSet;
            });
            toast.error("Failed to update progress");
        }
    };

    if (checkingAccess) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">Checking course access...</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center">
                        <Lock className="w-16 h-16 mx-auto text-red-500 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                        <p className="text-slate-600 mb-4">You need to purchase this course to access it.</p>
                        <Button onClick={() => navigate(`/course/${courseId}`)}>
                            View Course Details
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Course Not Found</h2>
                    <Button onClick={() => navigate("/student/enrolled-courses")}>
                        Back to My Courses
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            
            <div className="pt-20 flex h-screen">
                {/* Playlist Sidebar */}
                <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">
                            {course.title}
                        </h2>
                        {course.creator && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                by {course.creator.name}
                            </p>
                        )}
                    </div>

                    {/* Playlists */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {course.playlists.map((playlist, pIdx) => (
                            <div key={playlist._id}>
                                <button
                                    onClick={() => togglePlaylist(playlist._id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                            {pIdx + 1}. {playlist.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {playlist.videos.length} videos
                                        </p>
                                    </div>
                                    {expandedPlaylists.has(playlist._id) ? (
                                        <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    )}
                                </button>

                                {/* Videos */}
                                {expandedPlaylists.has(playlist._id) && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50">
                                        {playlist.videos.map((video, vIdx) => {
                                            const isPlaying = currentVideo?._id === video._id;
                                            const isCompleted = completedVideos.has(video._id);
                                            
                                            return (
                                                <button
                                                    key={video._id}
                                                    onClick={() => playVideo(video, playlist._id)}
                                                    className={`w-full p-3 pl-8 flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border-l-4 ${
                                                        isPlaying 
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                                                            : 'border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex-shrink-0 mt-1">
                                                        {isCompleted ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <PlayCircle className={`w-4 h-4 ${isPlaying ? 'text-blue-600' : 'text-slate-400'}`} />
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 text-left">
                                                        <p className={`text-sm font-medium ${
                                                            isPlaying 
                                                                ? 'text-blue-600 dark:text-blue-400' 
                                                                : 'text-slate-700 dark:text-slate-300'
                                                        }`}>
                                                            {vIdx + 1}. {video.title}
                                                        </p>
                                                        {video.duration && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Player Area */}
                <div className="flex-1 overflow-y-auto bg-black">
                    {currentVideo ? (
                        <div className="h-full flex flex-col">
                            <div className="flex-shrink-0">
                                <VideoPlayer
                                    src={currentVideo.videoUrl}
                                    poster={currentVideo.thumbnail}
                                    autoPlay={true}
                                    onEnded={() => markVideoComplete(currentVideo._id)}
                                />
                            </div>
                            
                            <div className="flex-1 bg-white dark:bg-slate-900 p-6">
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                    {currentVideo.title}
                                </h1>
                                {currentVideo.description && (
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        {currentVideo.description}
                                    </p>
                                )}
                                
                                <Button 
                                    onClick={() => markVideoComplete(currentVideo._id)}
                                    variant={completedVideos.has(currentVideo._id) ? "outline" : "default"}
                                    className="mt-4"
                                >
                                    {completedVideos.has(currentVideo._id) ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Completed
                                        </>
                                    ) : (
                                        'Mark as Complete'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-white">
                            <div className="text-center">
                                <PlayCircle className="w-20 h-20 mx-auto mb-4 text-slate-400" />
                                <p className="text-xl">Select a video to start learning</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
