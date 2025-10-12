import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import type { Video } from "../../client/src/types/video";
import Navbar from "@/components/layout/Navbar";

export default function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const state = location.state as { video?: Video } | null;

    const [video, setVideo] = useState<Video | null>(state?.video ?? null);
    const [loading, setLoading] = useState<boolean>(!state?.video);
    const [error, setError] = useState<string | null>(null);

    // Related videos state initialization to empty array
    const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
    const [relatedLoading, setRelatedLoading] = useState<boolean>(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);

    useEffect(() => {
        if (video || !id) return;

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
    }, [id, video]);

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
        return <div className="text-center py-10">Loading video details…</div>;
    if (error)
        return (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
        );
    if (!video) return <div className="text-center py-10">Video not found</div>;

    const src = video.hlsUrl ?? video.mp4Url;
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
                            poster={video.image}
                            autoPlay={true}
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
                                            src={
                                                video.thumbnailUrl ||
                                                video.image
                                            }
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
