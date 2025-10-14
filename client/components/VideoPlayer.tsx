// src/components/VideoPlayer.tsx
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { MoreVertical, Settings } from "lucide-react";

type Props = {
    src?: string;
    poster?: string;
    autoPlay?: boolean;
};

const VideoPlayer: React.FC<Props> = ({ src, poster, autoPlay = false }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [loading, setLoading] = useState<boolean>(!!src);
    const [error, setError] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [qualities, setQualities] = useState<number[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number | "auto">(
        "auto"
    );

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) {
            setLoading(false);
            return;
        }

        setError(null);
        setLoading(true);

    // more robust HLS detection: consider query params and content-type hints
    const isHls = /\.m3u8(\?|$)/i.test(src) || src.includes("hls") || src.includes("m3u8");

        if (isHls && Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;

            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(src);
            });

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setLoading(false);
                const levels = data.levels.map((lvl: any) =>
                    Math.round(lvl.height)
                );
                // Remove duplicates like [720, 720, 1080]
                const uniqueLevels = Array.from(new Set(levels)).sort(
                    (a, b) => b - a
                );
                setQualities(uniqueLevels);
                if (autoPlay) video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                console.error("HLS.js error", data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            setError("Video playback failed.");
                    }
                }
            });
        } else if (isHls && video.canPlayType && video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (iOS/Safari). Set src directly and let the browser handle m3u8.
            video.src = src;
            video.onloadedmetadata = () => {
                setLoading(false);
                if (autoPlay) video.play().catch(() => {});
            };
            video.onerror = (e) => {
                console.error('Native HLS playback error', e);
                setError('Video failed to load (native HLS).');
                setLoading(false);
            };
        } else {
            // Non-HLS or if Hls.js is not supported
            video.src = src;
            video.onloadedmetadata = () => {
                setLoading(false);
                if (autoPlay) video.play().catch(() => {});
            };
            video.onerror = (e) => {
                console.error('Video playback error', e);
                setError('Video failed to load. If this is an HLS stream, the browser may not support it and Hls.js is unavailable.');
                setLoading(false);
            };
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (video) video.src = "";
        };
    }, [src, autoPlay]);

    const handleQualityChange = (height: number | "auto") => {
        const hls = hlsRef.current;
        if (!hls) return;

        if (height === "auto") {
            hls.currentLevel = -1; // auto
        } else {
            const levelIndex = hls.levels.findIndex(
                (lvl) => Math.round(lvl.height) === height
            );
            if (levelIndex >= 0) hls.currentLevel = levelIndex;
        }
        setCurrentQuality(height);
        setShowMenu(false);
    };

    console.log(videoRef);

    return (
        <div className="relative w-full mx-auto">
            {loading && <div className="text-center py-4">Loading video…</div>}
            {error && <div className="text-red-500">{error}</div>}

            <video
                ref={videoRef}
                poster={poster}
                style={{ width: "100%", borderRadius: 8, background: "#000" }}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
            />

            {/* Settings / Quality Button */}
            <div className="absolute top-3 right-3">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 bg-black/60 rounded-full hover:bg-black/80"
                >
                    {showMenu ? (
                        <Settings className="w-5 h-5 text-white" />
                    ) : (
                        <Settings className="w-5 h-5 text-white bg-transparent" />
                    )}
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg text-sm py-2 z-50">
                        <div className="px-3 py-2 border-b border-gray-700">
                            <div className="font-semibold text-gray-300 mb-1">
                                Quality
                            </div>
                            <button
                                onClick={() => handleQualityChange("auto")}
                                className={`block w-full text-left px-2 py-1 rounded ${
                                    currentQuality === "auto"
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-800"
                                }`}
                            >
                                Auto
                            </button>
                            {qualities.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleQualityChange(q)}
                                    className={`block w-full text-left px-2 py-1 rounded ${
                                        currentQuality === q
                                            ? "bg-gray-700"
                                            : "hover:bg-gray-800"
                                    }`}
                                >
                                    {q}p
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
