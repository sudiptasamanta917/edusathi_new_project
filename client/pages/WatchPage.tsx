import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import type { Video } from "../../client/src/types/video";
import Navbar from "@/components/layout/Navbar";
import { StudentAPI, PublicAPI } from "@/Api/api";

export default function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { 
        video?: Video, 
        courseId?: string, 
        videoId?: string, 
        courseTitle?: string, 
        fromCourse?: boolean 
    } | null;

    console.log('WatchPage loaded:', { 
        id, 
        state, 
        hasVideoInState: !!state?.video,
        fromCourse: state?.fromCourse,
        courseId: state?.courseId
    });

    const [video, setVideo] = useState<Video | null>(null); // Always start with null to force API call
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<any>(null);
    const [accessInfo, setAccessInfo] = useState<any>(null);
    const [courseData, setCourseData] = useState<any>(null);
    const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

    // Related videos state initialization to empty array (keeping for backward compatibility)
    const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
    const [relatedLoading, setRelatedLoading] = useState<boolean>(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);

    // Progress tracking
    const [lastProgressUpdate, setLastProgressUpdate] = useState<number>(0);

    // Handle progress updates from video player
    const handleProgressUpdate = async (progress: { timeWatched: number; lastPosition: number; completed: boolean }) => {
        // Only update progress every 10 seconds to avoid too many API calls
        const now = Date.now();
        if (now - lastProgressUpdate < 10000 && !progress.completed) {
            return;
        }

        if (!state?.courseId || !id) return;

        try {
            console.log('Updating video progress:', progress);
            await StudentAPI.updateVideoProgress(state.courseId, id, progress);
            setLastProgressUpdate(now);
        } catch (error) {
            console.error('Error updating video progress:', error);
        }
    };

    useEffect(() => {
        if (!id) return;

        // If we have course context, always use StudentAPI to get proper video URL
        if (state?.courseId && state?.fromCourse) {
            console.log('Using StudentAPI for course video');
            fetchVideoWithAccess();
            fetchFullCourseData();
        } else if (!video) {
            // Only use fallback if no video and no course context
            console.log('Using legacy video fetch');
            fetchVideoLegacy();
        }
    }, [id, state]);

    const fetchVideoWithAccess = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching video with access:', { courseId: state!.courseId, videoId: id });
            
            // Check authentication first
            const token = 
                sessionStorage.getItem("access_token") ||
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("accessToken") ||
                localStorage.getItem("accessToken");
            
            console.log('Auth token available:', !!token);
            
            if (!token) {
                throw new Error('No authentication token found. Please login first.');
            }
            
            console.log('Calling StudentAPI.getVideo with:', {
                courseId: state!.courseId,
                videoId: id,
                apiCall: 'StudentAPI.getVideo'
            });
            
            const response = await StudentAPI.getVideo(state!.courseId!, id!);
            
            console.log('StudentAPI response received:', {
                success: response.success,
                hasVideo: !!response.video,
                videoId: response.video?._id,
                videoUrl: response.video?.videoUrl,
                hlsUrl: response.video?.hlsUrl,
                isHlsReady: response.video?.isHlsReady,
                hlsProcessing: response.video?.hlsProcessing,
                response: response
            });
            
            if (response.success) {
                setVideoData(response.video);
                setAccessInfo(response.access);
                setCourseData(response.course);
                
                // Find current video position in playlists
                if (response.playlist && response.navigation) {
                    setCurrentPlaylistIndex(response.playlist.index);
                    setCurrentVideoIndex(response.navigation.videoIndex);
                }
                
                // Determine the best video URL to use
                const getVideoUrl = () => {
                    console.log('Video URL selection:', {
                        hlsUrl: response.video.hlsUrl,
                        isHlsReady: response.video.isHlsReady,
                        videoUrl: response.video.videoUrl,
                        previewUrl: response.video.previewUrl,
                        hlsProcessing: response.video.hlsProcessing
                    });
                    
                    // Prefer HLS URL if available and ready
                    if (response.video.hlsUrl && response.video.isHlsReady) {
                        console.log('Using HLS URL:', response.video.hlsUrl);
                        return response.video.hlsUrl;
                    }
                    
                    // Use regular video URL
                    if (response.video.videoUrl) {
                        console.log('Using regular video URL:', response.video.videoUrl);
                        return response.video.videoUrl;
                    }
                    
                    // Use preview URL as fallback
                    if (response.video.previewUrl) {
                        console.log('Using preview URL:', response.video.previewUrl);
                        return response.video.previewUrl;
                    }
                    
                    console.log('No video URL available');
                    return null;
                };

                const videoUrl = getVideoUrl();
                console.log('Video URL for playback:', videoUrl);
                
                // Check if we have any playable URL
                if (!videoUrl) {
                    // Only show processing error if HLS is processing AND no regular video URL
                    if (response.video.hlsProcessing && !response.video.videoUrl) {
                        throw new Error('This video is still being processed. Please check back in a few minutes.');
                    } else {
                        throw new Error('No playable video URL available. The video might not be uploaded yet or is still processing.');
                    }
                }

                // Convert to Video format for compatibility
                const videoForPlayer: Video = {
                    id: response.video._id,
                    title: response.video.title,
                    description: response.video.description,
                    videoUrl: videoUrl,
                    thumbnail: response.video.thumbnail,
                    author: response.course?.title || 'Unknown',
                    duration: response.video.duration
                };
                
                console.log('Video for player:', videoForPlayer);
                setVideo(videoForPlayer);
            } else {
                throw new Error(response.message || 'Failed to load video');
            }
        } catch (err: any) {
            console.error('Error fetching video:', err);
            
            // Handle specific enrollment required error
            if (err.message && err.message.includes('enroll')) {
                setError('This video requires course enrollment. Please enroll in the course to watch all videos.');
            } else {
                setError(err.message || 'Failed to load video');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchFullCourseData = async () => {
        if (!state?.courseId) return;
        
        try {
            console.log('Fetching full course data for:', state.courseId);
            const response = await PublicAPI.getCourseById(state.courseId);
            
            if (response.status && response.data?.course) {
                console.log('Full course data received:', response.data.course);
                setCourseData(response.data.course);
                
                // Find current video position in the course playlists
                const course = response.data.course;
                let foundPlaylistIndex = -1;
                let foundVideoIndex = -1;
                
                for (let i = 0; i < course.playlists?.length || 0; i++) {
                    const playlist = course.playlists[i];
                    for (let j = 0; j < playlist.videos?.length || 0; j++) {
                        if (playlist.videos[j]._id === id) {
                            foundPlaylistIndex = i;
                            foundVideoIndex = j;
                            break;
                        }
                    }
                    if (foundPlaylistIndex !== -1) break;
                }
                
                if (foundPlaylistIndex !== -1 && foundVideoIndex !== -1) {
                    setCurrentPlaylistIndex(foundPlaylistIndex);
                    setCurrentVideoIndex(foundVideoIndex);
                    console.log('Found video position:', { playlistIndex: foundPlaylistIndex, videoIndex: foundVideoIndex });
                }
            }
        } catch (error) {
            console.error('Error fetching full course data:', error);
        }
    };

    const fetchVideoLegacy = () => {
        setLoading(true);
        fetch(`/api/videos/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || "Failed to fetch");
                }
                return res.json();
            })
            .then((data: Video) => {
                setVideo(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || "Failed to load video");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!id) return;

        setRelatedLoading(true);
        setRelatedError(null);

        // For testing: fetch videos.json locally or a static JSON URL
        fetch("/videos.json")
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || "Failed to fetch related videos");
                }
                return res.json();
            })
            .then((data: Video[]) => {
                setRelatedVideos(data);
                setRelatedLoading(false);
            })
            .catch((err) => {
                setRelatedError(err.message || "Failed to load related videos");
                setRelatedLoading(false);
            });
    }, [id]);

    // Function to switch to a different video in the course
    const switchToVideo = (videoId: string, playlistIndex: number, videoIndex: number) => {
        console.log('Switching to video:', { videoId, playlistIndex, videoIndex });
        
        navigate(`/watch/${videoId}`, {
            state: {
                courseId: state?.courseId,
                courseTitle: state?.courseTitle,
                fromCourse: true
            }
        });
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                    <div className="text-xs text-gray-500 mt-4">
                        <p>Video ID: {id}</p>
                        <p>Course ID: {state?.courseId}</p>
                        <p>From Course: {state?.fromCourse ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">
                        <h2 className="text-xl font-bold mb-2">Error Loading Video</h2>
                        <p>{error}</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-4">
                        <p>Debug Info:</p>
                        <p>Video ID: {id}</p>
                        <p>Course ID: {state?.courseId || 'Not provided'}</p>
                        <p>From Course: {state?.fromCourse ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        );
    if (!video) 
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Video Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">The video you're looking for doesn't exist.</p>
                    <div className="text-sm text-gray-500 mt-4">
                        <p>Debug Info:</p>
                        <p>Video ID: {id}</p>
                        <p>Course ID: {state?.courseId || 'Not provided'}</p>
                    </div>
                </div>
            </div>
        );

    const src = video.videoUrl;
    console.log('Video URL for playback:', {
        videoUrl: src,
        videoObject: video,
        hasVideoUrl: !!src
    });

    if (!src)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-red-600 mb-4">No Playable URL Available</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The video doesn't have a playable URL. This might be because:
                    </p>
                    <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-1">
                        <li>• Video is still being processed</li>
                        <li>• Video file was not uploaded properly</li>
                        <li>• HLS conversion is in progress</li>
                    </ul>
                    <div className="text-xs text-gray-400 mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                        <p>Debug Info:</p>
                        <p>Video ID: {id}</p>
                        <p>Course ID: {state?.courseId}</p>
                        <p>Video Title: {video.title}</p>
                        <p>Has videoUrl: {!!video.videoUrl ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Navbar />
            
            {/* YouTube-like Layout */}
            <div className="flex flex-col lg:flex-row gap-6 mt-16 p-4 max-w-screen-2xl mx-auto">
                
                {/* Main Video Section - YouTube Style */}
                <div className="flex-1 lg:max-w-4xl">
                    {/* Video Player */}
                    <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                        <VideoPlayer
                            src={src}
                            onProgressUpdate={handleProgressUpdate}
                        />
                    </div>
                    
                    {/* Video Info Section */}
                    <div className="mt-4">
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {video.title}
                        </h1>
                        
                        {/* Video Meta Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#6343e7] to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {video.author?.charAt(0)?.toUpperCase() || 'C'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {video.author || 'Course Instructor'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {courseData?.title || state?.courseTitle}
                                </p>
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {video.description || 'No description available.'}
                            </p>
                            {courseData?.playlists && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Video {currentVideoIndex + 1} of {courseData.playlists[currentPlaylistIndex]?.videos?.length || 0} 
                                        • Playlist: {courseData.playlists[currentPlaylistIndex]?.title || `Playlist ${currentPlaylistIndex + 1}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - YouTube Style Playlist */}
                <div className="lg:w-96 lg:flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Playlist Header */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {courseData?.title || state?.courseTitle || 'Course Videos'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {courseData?.playlists?.reduce((total: number, playlist: any) => 
                                    total + (playlist.videos?.length || 0), 0) || 0} videos • {courseData?.playlists?.length || 0} playlists
                            </p>
                        </div>

                        {/* Video List */}
                        {courseData?.playlists && courseData.playlists.length > 0 ? (
                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                {courseData.playlists.map((playlist: any, playlistIndex: number) => (
                                    <div key={playlist._id || playlistIndex}>
                                        {/* Playlist Divider */}
                                        {playlistIndex > 0 && (
                                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2">
                                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {playlist.title || `Playlist ${playlistIndex + 1}`}
                                                </h3>
                                            </div>
                                        )}
                                        
                                        {playlist.videos && playlist.videos.length > 0 && (
                                            <div>
                                                {playlist.videos.map((video: any, videoIndex: number) => {
                                                    const isCurrentVideo = video._id === id;
                                                    const globalVideoNumber = courseData.playlists
                                                        .slice(0, playlistIndex)
                                                        .reduce((total: number, pl: any) => total + (pl.videos?.length || 0), 0) + videoIndex + 1;
                                                    
                                                    return (
                                                        <div
                                                            key={video._id || videoIndex}
                                                            onClick={() => switchToVideo(video._id, playlistIndex, videoIndex)}
                                                            className={`cursor-pointer p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                                isCurrentVideo ? 'bg-[#6343e7]/10 dark:bg-[#6343e7]/20 border-l-4 border-l-[#6343e7]' : ''
                                                            }`}
                                                        >
                                                            <div className="flex gap-3">
                                                                {/* Video Thumbnail */}
                                                                <div className="flex-shrink-0 relative">
                                                                    {video.thumbnail ? (
                                                                        <div className="relative">
                                                                            <img 
                                                                                src={video.thumbnail} 
                                                                                alt={video.title}
                                                                                className="w-20 h-12 object-cover rounded bg-gray-200 dark:bg-gray-700"
                                                                                onError={(e) => {
                                                                                    // Fallback if thumbnail fails to load
                                                                                    e.currentTarget.style.display = 'none';
                                                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                                                    if (nextElement) {
                                                                                        nextElement.style.display = 'flex';
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <div className="hidden w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded items-center justify-center">
                                                                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M8 5v14l11-7z"/>
                                                                                </svg>
                                                                            </div>
                                                                            {/* Play overlay for current video */}
                                                                            {isCurrentVideo && (
                                                                                <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center">
                                                                                    <div className="w-6 h-6 bg-[#6343e7] rounded-full flex items-center justify-center">
                                                                                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                                            <path d="M8 5v14l11-7z"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {/* Video number badge */}
                                                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                                                                {globalVideoNumber}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={`w-20 h-12 rounded flex items-center justify-center text-sm font-medium ${
                                                                            isCurrentVideo 
                                                                                ? 'bg-[#6343e7] text-white' 
                                                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                                        }`}>
                                                                            {isCurrentVideo ? (
                                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M8 5v14l11-7z"/>
                                                                                </svg>
                                                                            ) : (
                                                                                globalVideoNumber
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Video Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className={`text-sm font-medium line-clamp-2 ${
                                                                        isCurrentVideo 
                                                                            ? 'text-[#6343e7] dark:text-[#8b7cf7]' 
                                                                            : 'text-gray-900 dark:text-white'
                                                                    }`}>
                                                                        {video.title || `Video ${videoIndex + 1}`}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {video.duration && (
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {typeof video.duration === 'number' 
                                                                                    ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`
                                                                                    : video.duration
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        {isCurrentVideo && (
                                                                            <span className="text-xs text-[#6343e7] dark:text-[#8b7cf7] font-medium">
                                                                                • Now Playing
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {courseData ? 'No videos available' : 'Loading course content...'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
