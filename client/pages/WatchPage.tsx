import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import type { Video } from "../../client/src/types/video";
import Navbar from "@/components/layout/Navbar";
import { StudentAPI } from "@/Api/api";

export default function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const state = location.state as { 
        video?: Video, 
        courseId?: string, 
        videoId?: string, 
        courseTitle?: string, 
        fromCourse?: boolean 
    } | null;

    console.log('WatchPage loaded:', { id, state });

    const [video, setVideo] = useState<Video | null>(state?.video ?? null);
    const [loading, setLoading] = useState<boolean>(!state?.video);
    const [error, setError] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<any>(null);
    const [accessInfo, setAccessInfo] = useState<any>(null);

    // Related videos state initialization to empty array
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
        // If we have video from navigation state, use it
        if (video || !id) return;

        // If we have course context, use StudentAPI
        if (state?.courseId && state?.fromCourse) {
            fetchVideoWithAccess();
        } else {
            // Fallback to old method for backward compatibility
            fetchVideoLegacy();
        }
    }, [id, video, state]);

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
            
            const response = await StudentAPI.getVideo(state!.courseId!, id!);
            
            console.log('StudentAPI response:', response);
            
            if (response.success) {
                setVideoData(response.video);
                setAccessInfo(response.access);
                
                // Convert to Video format for compatibility
                const videoForPlayer: Video = {
                    id: response.video._id,
                    title: response.video.title,
                    description: response.video.description,
                    videoUrl: response.video.videoUrl || response.video.previewUrl,
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

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading video details…</p>
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
    console.log(src);

    if (!src)
        return (
            <div className="text-center py-10 text-red-500">
                No playable URL available
            </div>
        );

    return (
        <div className="bg-white dark:bg-slate-900/80 min-h-screen">
            <Navbar />
            <div className="md:flex">
                <div className="2xl:w-[75%] xl:w-[73%] md:w-[70%] mt-20">
                    <div className="mt-4 md:pl-10 md:pr-6 px-5">
                        <VideoPlayer
                            src={src}
                            poster={video.thumbnail}
                            autoPlay={false}
                            courseId={state?.courseId}
                            videoId={id}
                            onProgressUpdate={handleProgressUpdate}
                        />
                    </div>
                    <h1 className="text-2xl font-bold mt-3 md:pl-10 md:pr-6 px-5">
                        {video.title}
                    </h1>
                    <p className="text-sm text-gray-600 md:pl-10 md:pr-6 px-5">
                        {video.author}
                    </p>
                    <div className="mt-4 text-gray-700 md:pl-10 md:pr-6 px-5">
                        <p>{video.description}</p>
                    </div>
                </div>

                <div className="2xl:w-[25%] xl:w-[28%] md:w-[30%] mt-20 pt-4 md:pr-10 md:pl-0 px-5 pb-5">
                    <h2 className="mb-2 font-bold text-lg text-gray-800 dark:text-white">
                        Related Videos
                    </h2>
                    {relatedLoading && <div>Loading related videos…</div>}
                    {relatedError && (
                        <div className="text-red-500">
                            Error: {relatedError}
                        </div>
                    )}

                    {relatedVideos && relatedVideos.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {relatedVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    to={`/watch/${video.id}`}
                                    state={{ video }}
                                    className="block"
                                >
                                    <div className="bg-white dark:bg-transparent rounded flex shadow hover:shadow-md transition">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-[50%] xl:h-32 lg:h-28 md:h-24 h-20 object-cover rounded"
                                        />
                                        <div className="px-3 pb-2 overflow-hidden w-[50%]">
                                            <h3 className="text-base font-semibold truncate">
                                                {video.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 truncate">
                                                {video.author}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        !relatedLoading && <p>No related videos found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
