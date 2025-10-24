import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Clock, Star, Play, Lock, BookOpen } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicAPI, StudentAPI } from "@/Api/api";
import { getCourseThumbnail } from "@/utils/imageUtils";

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
  originalPrice?: number;
  previewVideo?: string;
  creator: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    totalStudents?: number;
    totalCourses?: number;
    rating?: number;
  };
  playlists?: Array<{
    _id: string;
    title?: string;
    description?: string;
    order?: number;
    videoCount?: number;
    totalDuration?: string;
    videos?: Array<{
      _id?: string;
      title?: string;
      description?: string;
      duration?: string;
      hlsUrl?: string;
      hlsProcessing?: boolean;
      thumbnail?: string;
      isPremium?: boolean;
      isLocked?: boolean;
    }>;
  }>;
  stats?: {
    totalStudents?: number;
    totalReviews?: number;
    averageRating?: number;
    totalDuration?: string;
    lastUpdated?: string;
  };
  features?: string[];
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
};

export default function CourseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<any>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  useEffect(() => {
    // If course data is not available from navigation state, fetch it from API
    if (id) {
      // If we have a course from navigation but it lacks playlists, fetch full details
      if (course && (!course.playlists || course.playlists.length === 0)) {
        fetchCourseDetails();
        return;
      }

      if (!course) {
        fetchCourseDetails();
      }
    }
  }, [id, course]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PublicAPI.getCourseById(id!);
      
      if (response.status && response.data?.course) {
        setCourse(response.data.course);
      } else {
        setError(response.error || "Failed to load course details");
      }
    } catch (err: any) {
      console.error("Error fetching course details:", err);
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  // Check enrollment status for logged in students
  const checkEnrollmentStatus = async () => {
    if (!course || !id) {
      console.log('Cannot check enrollment status: missing course or id');
      return;
    }

    const token = 
      sessionStorage.getItem('access_token') || 
      localStorage.getItem('access_token') || 
      sessionStorage.getItem('accessToken') || 
      localStorage.getItem('accessToken');
    
    const userRole = 
      sessionStorage.getItem('userRole') || 
      localStorage.getItem('userRole');

    if (!token || userRole !== 'student') {
      return;
    }

    try {
      const response = await StudentAPI.getCourseEnrollmentStatus(id);
      
      if (response.success) {
        setEnrollmentStatus(response);
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  // Check enrollment status when course loads
  useEffect(() => {
    if (course) {
      checkEnrollmentStatus();
    }
  }, [course]);


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Course</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchCourseDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return 'N/A';
    }
  };

  // Format seconds into human readable string (e.g., 3660 -> "1 hr 1 min")
  function formatSeconds(secondsInput: any) {
    const secs = Number(secondsInput);
    if (!secs || isNaN(secs) || secs <= 0) return 'N/A';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min${minutes > 1 ? 's' : ''}` : ''}`;
    }
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  }

  // Fallback data for missing course properties
  const safeTitle = course?.title || 'Course Title';
  const safeDescription = course?.description || 'Course description not available.';
  const safeCreator = course?.creator || null;
  const safeCreatorName = safeCreator?.name || 'Unknown Creator';
  const safeSubject = course?.subject || 'General';
  const safeGrade = course?.grade || 'N/A';
  const safeLevel = course?.level || 'Beginner';
  const safePlaylists = course?.playlists || [];
  const safeFeatures = course?.features || ['Comprehensive learning experience'];
  const safeStats = course?.stats || {
    totalStudents: 0,
    totalReviews: 0,
    averageRating: 4.5,
    totalDuration: 'N/A',
    lastUpdated: new Date().toISOString()
  };

  // Compute total duration for a playlist (based on videos' durations, preferring numeric seconds)
  function computePlaylistDuration(playlist: any) {
    if (!playlist) return 'N/A';
    const videos = playlist.videos || [];
    const totalSeconds = videos.reduce((acc: number, v: any) => {
      if (!v) return acc;
      if (typeof v.duration === 'number') return acc + (v.duration || 0);
      // try to extract number from string
      const parsed = parseInt(String(v.duration || '').replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) return acc + parsed;
      return acc;
    }, 0);
    return totalSeconds > 0 ? formatSeconds(totalSeconds) : 'N/A';
  }

  // Compute course total duration from playlists/videos
  function computeCourseTotalDuration(playlists: any[]) {
    const totalSeconds = (playlists || []).reduce((pAcc: number, pl: any) => {
      const videos = pl.videos || [];
      return pAcc + videos.reduce((vAcc: number, v: any) => {
        if (!v) return vAcc;
        if (typeof v.duration === 'number') return vAcc + (v.duration || 0);
        const parsed = parseInt(String(v.duration || '').replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) return vAcc + parsed;
        return vAcc;
      }, 0);
    }, 0);
    return totalSeconds > 0 ? formatSeconds(totalSeconds) : (safeStats.totalDuration || 'N/A');
  }
  // Safe course-level fallbacks
  const safeIsPaid = !!course?.isPaid;
  const safePrice = typeof course?.price === 'number' ? course.price : Number(course?.price) || 0;
  const safeOriginalPrice = (typeof course?.originalPrice === 'number' ? course.originalPrice : (course?.originalPrice ? Number(course.originalPrice) : null));
  const safeThumbnail = course?.thumbnail || '/placeholder.jpg';

  // Handle enrollment actions
  const handleEnrollment = (action: 'cart' | 'buy') => {
    // Check if user is logged in - check both localStorage and sessionStorage
    const token = 
      sessionStorage.getItem('access_token') || 
      localStorage.getItem('access_token') || 
      sessionStorage.getItem('accessToken') || 
      localStorage.getItem('accessToken') || 
      localStorage.getItem('token');
    
    const userRole = 
      sessionStorage.getItem('userRole') || 
      localStorage.getItem('userRole');
    
    if (!token) {
      // Redirect to login page if not logged in
      navigate('/auth', { 
        state: { 
          redirectTo: `/course/${id}`,
          action: action,
          courseTitle: safeTitle,
          message: `Please login to ${action === 'cart' ? 'add this course to cart' : 'buy this course'}`
        }
      });
      return;
    }

    // Check if user is a student
    if (userRole !== 'student') {
      alert('Only students can enroll in courses. Please login with a student account.');
      navigate('/auth', { 
        state: { 
          redirectTo: `/course/${id}`,
          action: action,
          courseTitle: safeTitle,
          message: 'Please login with a student account to enroll in courses'
        }
      });
      return;
    }

    // If logged in as student, proceed with enrollment
    if (action === 'cart') {
      handleAddToCart();
    } else {
      handleBuyNow();
    }
  };

  const handleAddToCart = () => {
    if (!course) return;
    
    // For free courses, enroll directly instead of adding to cart
    if (!course.isPaid) {
      handleFreeCourseEnrollment();
      return;
    }
    
    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('studentCart');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if course is already in cart
      if (cartItems.some((item: any) => item.courseId === course._id)) {
        alert('This course is already in your cart!');
        return;
      }
      
      // Add course to cart
      const cartItem = {
        courseId: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        creator: course.creator?.name,
        addedAt: new Date().toISOString()
      };
      
      cartItems.push(cartItem);
      localStorage.setItem('studentCart', JSON.stringify(cartItems));
      
      // Show success message and redirect to student dashboard
      alert('Course added to cart successfully!');
      navigate('/student', { 
        state: { 
          message: 'Course added to cart successfully!',
          activeTab: 'cart'
        }
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add course to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!course) return;
    
    if (course.isPaid) {
      // For paid courses, redirect to checkout
      navigate('/checkout', { 
        state: { 
          course: course,
          type: 'course_purchase'
        }
      });
    } else {
      // For free courses, enroll directly via API
      handleFreeCourseEnrollment();
    }
  };

  // Handle free course enrollment
  const handleFreeCourseEnrollment = async () => {
    if (!course) return;

    console.log('Starting free course enrollment for:', course._id);

    try {
      setEnrollmentLoading(true);
      
      // Call API to enroll in free course
      console.log('Calling StudentAPI.enrollInFreeCourse...');
      const response = await StudentAPI.enrollInFreeCourse(course._id);
      console.log('Enrollment API response:', response);
      
      if (response.success) {
        // Update enrollment status
        setEnrollmentStatus({
          success: true,
          isEnrolled: true,
          enrollmentDetails: {
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedVideos: 0,
            totalWatchTime: 0,
            isCompleted: false
          },
          courseInfo: {
            _id: course._id,
            title: course.title,
            isPaid: course.isPaid,
            price: course.price
          }
        });
        
        // Refresh enrollment status from server
        await checkEnrollmentStatus();
        
        alert('Successfully enrolled in the course! You can now access all videos.');
      } else {
        // Check if user is already enrolled
        if (response.message && response.message.includes('Already enrolled')) {
          console.log('User is already enrolled, updating UI...');
          
          // Update enrollment status to show enrolled state
          setEnrollmentStatus({
            success: true,
            isEnrolled: true,
            enrollmentDetails: {
              enrolledAt: new Date().toISOString(), // We don't have the actual date, use current
              progress: 0,
              completedVideos: 0,
              totalWatchTime: 0,
              isCompleted: false
            },
            courseInfo: {
              _id: course._id,
              title: course.title,
              isPaid: course.isPaid,
              price: course.price
            }
          });
          
          // Also refresh from server to get accurate data
          await checkEnrollmentStatus();
          
          alert('You are already enrolled in this course! You can start learning now.');
        } else {
          alert('Enrollment failed: ' + (response.message || 'Unknown error'));
        }
      }
      
    } catch (error: any) {
      console.error('Error enrolling in free course:', error);
      
      // Parse error message - it might be a JSON string
      let errorMessage = error.message || '';
      let parsedError = null;
      
      try {
        // Try to parse JSON error message
        parsedError = JSON.parse(errorMessage);
        errorMessage = parsedError.message || errorMessage;
      } catch (e) {
        // Not JSON, use as is
      }
      
      console.log('Parsed error:', { errorMessage, parsedError });
      
      // Check if the error indicates already enrolled
      if (errorMessage.includes('Already enrolled') || parsedError?.isEnrolled) {
        console.log('Caught already enrolled error, updating UI...');
        
        // Update enrollment status to show enrolled state
        setEnrollmentStatus({
          success: true,
          isEnrolled: true,
          enrollmentDetails: {
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedVideos: 0,
            totalWatchTime: 0,
            isCompleted: false
          },
          courseInfo: {
            _id: course._id,
            title: course.title,
            isPaid: course.isPaid,
            price: course.price
          }
        });
        
        // Refresh from server to get accurate enrollment data
        setTimeout(async () => {
          await checkEnrollmentStatus();
        }, 500); // Small delay to ensure server state is updated
        
        alert('You are already enrolled in this course! You can start learning now.');
      } else {
        alert(errorMessage || 'Failed to enroll in course. Please try again.');
      }
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Handle video click
  const handleVideoClick = (videoId: string, isLocked: boolean, isProcessing = false) => {
    if (!course) return;

    if (isProcessing) {
      alert('This video is still processing. Please check back in a few minutes.');
      return;
    }

    console.log('Video clicked:', { videoId, isLocked, isProcessing, courseId: course._id });

    // Check if user is logged in
    const token =
      sessionStorage.getItem('access_token') ||
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token');

    const userRole =
      sessionStorage.getItem('userRole') ||
      localStorage.getItem('userRole');

    console.log('Auth check:', { token: !!token, userRole });

    if (!token) {
      // Redirect to login if not logged in
      navigate('/auth', {
        state: {
          redirectTo: `/course/${course._id}`,
          message: 'Please login to watch videos'
        }
      });
      return;
    }

    if (userRole !== 'student') {
      alert('Only students can watch videos. Please login with a student account.');
      navigate('/auth', {
        state: {
          redirectTo: `/course/${course._id}`,
          message: 'Please login with a student account to watch videos'
        }
      });
      return;
    }

    if (course.isPaid) {
      // Check if user is enrolled in paid course
      const isEnrolled = enrollmentStatus?.isEnrolled || false;

      if (!isEnrolled) {
        alert('This video is locked. Please enroll in the course to access all videos. You can watch the preview video above.');
        return;
      }
    }

    console.log('Navigating to watch page:', `/watch/${videoId}`);

    // Navigate to watch page with course and video info
    navigate(`/watch/${videoId}`, {
      state: {
        courseId: course._id,
        videoId: videoId,
        courseTitle: course.title,
        fromCourse: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8 mt-20">
        {/* ---------- LEFT CONTENT ---------- */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {safeTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
              {safeDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {safeCreatorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{safePlaylists.length} Playlists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{computeCourseTotalDuration(safePlaylists)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{safeStats.averageRating} ({(safeStats.totalReviews || 0).toLocaleString()}+ ratings)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                {safeSubject}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                Grade {safeGrade}
              </span>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                {safeLevel} Level
              </span>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What you'll learn
            </h2>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 dark:text-gray-300">
              {safeFeatures.map((feature, index) => (
                <li key={index}>✔ {feature}</li>
              ))}
            </ul>
          </div>

          {/* Course Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Course Content
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {safePlaylists.length} playlist{safePlaylists.length !== 1 ? 's' : ''} • 
                {safePlaylists.reduce((total, playlist) => total + (playlist.videoCount || 0), 0)} videos
              </div>
            </div>

            <div className="space-y-4">
              {safePlaylists.length > 0 ? (
                safePlaylists.map((playlist, index) => (
                <div
                  key={playlist._id || index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Playlist Header */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {playlist.title || `Playlist ${index + 1}`}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              {playlist.videoCount || 0} videos
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {computePlaylistDuration(playlist)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {safeIsPaid && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                            <Lock className="w-3 h-3" />
                            Premium
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {playlist.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-11">
                        {playlist.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Video List */}
                  {playlist.videos && playlist.videos.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {playlist.videos.map((video, vIndex) => {
                        const isVideoLocked = safeIsPaid && !enrollmentStatus?.isEnrolled;
                        const isVideoCompleted = enrollmentStatus?.enrollmentDetails?.completedVideos > vIndex;
                        
                        return (
                          <div 
                            key={video._id || vIndex} 
                            className={`p-4 transition-colors ${
                              isVideoLocked ? 'hover:bg-red-50 dark:hover:bg-red-900/10 cursor-not-allowed opacity-75' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer'
                            }`}
                            onClick={() => handleVideoClick(video._id || '', isVideoLocked, !!video.hlsProcessing)}
                          >
                        
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-600 dark:text-gray-400">{vIndex + 1}</span>
                              </div>
                              
                              {video.thumbnail && (
                                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden flex-shrink-0 relative">
                                  <img 
                                    // src={video.thumbnail} 
                                    src="/class5.avif"
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                    <Play className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {video.title || `Video ${vIndex + 1}`}
                                </p>
                                {/* HLS processing badge */}
                                {video.hlsProcessing && (
                                  <div className="inline-block ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                    Processing
                                  </div>
                                )}
                                {video.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {video.duration || 'Duration not available'}
                                  </span>
                                  {video.isPremium && (
                                    <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                                      Premium
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-3">
                              {isVideoLocked ? (
                                <div className="flex items-center gap-1 text-red-500">
                                  <Lock className="w-4 h-4" />
                                  <span className="text-xs">Enroll Required</span>
                                </div>
                              ) : isVideoCompleted ? (
                                <div className="flex items-center gap-1 text-green-500">
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-xs">Completed</span>
                                </div>
                              ) : enrollmentStatus?.isEnrolled ? (
                                <div className="flex items-center gap-1 text-blue-500">
                                  <Play className="w-4 h-4" />
                                  <span className="text-xs">Available</span>
                                </div>
                              ) : video.isLocked ? (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Lock className="w-4 h-4" />
                                  <span className="text-xs">Locked</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Play className="w-4 h-4" />
                                  <span className="text-xs font-medium">Watch</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No videos in this playlist yet</p>
                    </div>
                  )}
                </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No course content available</h3>
                  <p className="text-gray-600 dark:text-gray-400">This course doesn't have any playlists or videos yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing Box */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Preview Video for Paid Courses */}
              {(() => {
              console.log('Preview video check:', {
                safeIsPaid,
                hasPreviewVideo: !!course?.previewVideo,
                previewVideoUrl: course?.previewVideo
              });
              
              // For testing - use a sample video if no preview video exists
              const testVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
              // Prefer HLS preview if provided (either .m3u8 or hlsUrl field)
              const rawPreview = course?.previewVideo || null;
              const previewIsHls = typeof rawPreview === 'string' && (/\.m3u8(\?|$)/i.test(rawPreview) || rawPreview.includes('/hls/'));
              const previewUrl = rawPreview || (safeIsPaid ? testVideoUrl : null);

              return safeIsPaid ? (
                <div className="relative">
                  {previewUrl ? (
                    previewIsHls ? (
                      <VideoPlayer src={previewUrl} poster={getCourseThumbnail(safeThumbnail)} autoPlay={false} />
                    ) : (
                      <video
                        className="w-full h-48 object-cover"
                        controls
                        autoPlay
                        muted
                        poster={getCourseThumbnail(safeThumbnail)}
                        onError={(e) => {
                          console.error('Video error:', e);
                          console.log('Failed video URL:', previewUrl);
                        }}
                        onLoadStart={() => console.log('Video loading started')}
                        onCanPlay={() => console.log('Video can play')}
                      >
                        <source src={previewUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Preview video not available</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {previewUrl ? 'Preview' : 'No Preview'}
                  </div>
                </div>
              ) : (
                <img
                  src={getCourseThumbnail(safeThumbnail)}
                  alt={safeTitle}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.log('Thumbnail load error:', safeThumbnail);
                    (e.target as HTMLImageElement).src = "/class5.avif";
                  }}
                />
              );
            })()}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {safeIsPaid ? `₹${safePrice}` : 'Free'}
                </p>
                {safeIsPaid && safeOriginalPrice && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                    ₹{safeOriginalPrice}
                  </p>
                )}
              </div>


              {enrollmentStatus?.isEnrolled ? (
                <div className="space-y-4">
                  {/* Enrollment Status */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 dark:text-green-300 font-semibold">Enrolled</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Enrolled on {new Date(enrollmentStatus.enrollmentDetails?.enrolledAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    
                    {/* Progress Information */}
                    {enrollmentStatus.enrollmentDetails && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {enrollmentStatus.enrollmentDetails.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollmentStatus.enrollmentDetails.progress || 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{enrollmentStatus.enrollmentDetails.completedVideos || 0} videos completed</span>
                          {enrollmentStatus.enrollmentDetails.isCompleted && (
                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Completed</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        // Navigate to first video of the course
                        if (course?.playlists?.[0]?.videos?.[0]) {
                          const firstVideo = course.playlists[0].videos[0];
                          console.log('Navigating to first video:', firstVideo);
                          navigate(`/watch/${firstVideo._id}`, {
                            state: {
                              video: firstVideo,
                              courseId: course._id,
                              courseTitle: course.title,
                              fromCourse: true
                            }
                          });
                        } else {
                          // No videos available yet
                          alert('No videos are available in this course yet. Please check back later or contact the instructor.');
                          console.log('No videos found in course playlists:', course?.playlists);
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue Learning
                    </button>
                    <button 
                      onClick={() => navigate(`/student`, { state: { activeTab: 'courses' } })}
                      className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-lg font-semibold transition"
                    >
                      Go to My Courses
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleEnrollment('cart')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                    disabled={enrollmentLoading}
                  >
                    {enrollmentLoading ? 'Processing...' : (safeIsPaid ? 'Add to cart' : 'Enroll for Free')}
                  </button>
                  <button 
                    onClick={() => handleEnrollment('buy')}
                    className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 py-3 rounded-lg font-semibold transition"
                    disabled={enrollmentLoading}
                  >
                    {safeIsPaid ? 'Buy now' : 'Start Learning'}
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                 • Full Lifetime Access
              </p>
            </div>
          </div>

          {/* Similar Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Students also bought
            </h3>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <img
                    // src={`/placeholder-${i}.jpg`}
                    src="/class5.avif"
                    alt={`Course ${i}`}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      The Complete Web Development Bootcamp
                    </p>
                    <p className="text-yellow-500 text-sm">★★★★☆ 4.7</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                      ₹499
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              About the Instructor
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                {safeCreator && safeCreator.profilePicture ? (
                  <img 
                    src={safeCreator.profilePicture} 
                    alt={safeCreator.name || safeCreatorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {safeCreator?.name || safeCreatorName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Course Creator
                </p>
              </div>
            </div>
            
            {/* Creator Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-semibold text-gray-900 dark:text-white">
                    {(safeCreator && safeCreator.totalStudents && typeof safeCreator.totalStudents === 'number') ? safeCreator.totalStudents.toLocaleString() : '0'}
                  </div>
                <div className="text-gray-600 dark:text-gray-400">Students</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {safeCreator?.totalCourses || '0'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Courses</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {safeCreator?.bio || "Passionate educator dedicated to helping students achieve their learning goals."}
            </p>
            
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-900 dark:text-white font-semibold">
                {safeCreator?.rating || '4.7'} Instructor Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
