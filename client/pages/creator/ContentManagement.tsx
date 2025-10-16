import React, { useState, useEffect } from "react";
import { Upload, Edit2, PlusCircle } from "lucide-react";
import { Video, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ContentAPI } from "../../Api/api";
import Sidebar from "./SideBar";
import CreateCourse from "./CreateCourse";

interface Video {
    id: number;
    title: string;
    date: string;
    views: number;
    comments: number;
    likes: number;
}

interface Course {
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string;
    isPaid: boolean;
    price?: number;
}

type UploadResponse = {
    status?: boolean;
    success?: boolean;
    message?: string;
    error?: string;
    [k: string]: any;
};

interface Playlist {
    id: number;
    name: string;
    description: string;
    videos: Video[];
}

const ContentManagement: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [course, setCourse] = useState<Course>({
        title: "",
        description: "",
        subject: "",
        grade: "",
        level: "",
        thumbnail: "",
        isPaid: false,
        price: 0,
    });
      const [loading1, setLoading1] = useState(false);
      const [message, setMessage] = useState("");

    // Fetch videos & playlists from backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const videosData = await ContentAPI.getVideos();
                if (videosData.status && videosData.data?.videos) {
                    const formattedVideos = videosData.data.videos.map((v: any, index: number) => ({
                        id: index + 1,
                        title: v.title,
                        date: new Date(v.createdAt).toLocaleDateString(),
                        views: v.views || 0,
                        comments: 0, // Not available in API yet
                        likes: v.likes || 0,
                    }));
                    setVideos(formattedVideos);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
                // Set empty array as fallback
                setVideos([]);
            }
            setPlaylists([]); // Playlists not implemented yet
        };
        
        fetchData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setThumbnail(f);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a video file to upload.");
            return;
        }
        if (!title.trim()) {
            alert("Please enter a title for the video.");
            return;
        }

        const formData = new FormData();
        formData.append("videoFile", selectedFile);
        formData.append("title", title);
        formData.append("description", description);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }
        formData.append("duration", "360");
        formData.append("quality", "1080p");
        formData.append("course", "000000000000000000000000"); // Default course ID
        formData.append("playlistOrder", "1");
        formData.append("isPublic", "true");
        formData.append("isPremium", "false");
        formData.append("views", "0");
        formData.append("likes", "0");

        try {
            setLoading(true);
            const result = await ContentAPI.uploadVideo(formData);
            console.log("Upload Response:", result);

            if (result.status) {
                alert("✅ Video uploaded successfully!");
                setVideos([
                    {
                        id: videos.length + 1,
                        title: selectedFile.name,
                        date: new Date().toLocaleDateString(),
                        views: 0,
                        comments: 0,
                        likes: 0,
                    },
                    ...videos,
                ]);
                setSelectedFile(null);
                setTitle("");
                setDescription("");
                setThumbnail(null);
            } else {
                alert(`❌ Upload failed: ${result.error || result.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("⚠️ Something went wrong during upload. Please check your login status.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName) return;

        // Placeholder for API call
        // const res = await fetch("/api/playlists", {
        //   method: "POST",
        //   body: JSON.stringify({ name: newPlaylistName, description: newPlaylistDesc }),
        // });
        // const newPlaylist = await res.json();

        const newPlaylist: Playlist = {
            id: playlists.length + 1,
            name: newPlaylistName,
            description: newPlaylistDesc,
            videos: [],
        };

        setPlaylists([newPlaylist, ...playlists]);
        setNewPlaylistName("");
        setNewPlaylistDesc("");
    };

    const handleEditPlaylist = async (
        playlistId: number,
        name: string,
        desc: string
    ) => {
        // Placeholder for API call
        // await fetch(`/api/playlists/${playlistId}`, { method: "PUT", body: JSON.stringify({ name, desc }) });

        setPlaylists(
            playlists.map((pl) =>
                pl.id === playlistId ? { ...pl, name, description: desc } : pl
            )
        );
    };

    const handleAddVideoToPlaylist = async (
        playlistId: number,
        video: Video
    ) => {
        // Placeholder for API call
        // await fetch(`/api/playlists/${playlistId}/add-video`, { method: "POST", body: JSON.stringify({ videoId: video.id }) });

        setPlaylists(
            playlists.map((pl) =>
                pl.id === playlistId
                    ? { ...pl, videos: [...pl.videos, video] }
                    : pl
            )
        );
    };

    return (
        <div className="flex min-h-screen bg-[#282828] text-white">
            <Sidebar />
            <div className="p-6 w-full">
                <h1 className="text-2xl font-bold mb-6 text-white">
                    Content Management
                </h1>

                <div className="grid grid-cols-2 gap-6">
                    <div className="">
                        {/* Upload Card */}
                        <div className="bg-[#1f1f1f] border border-gray-700 rounded-2xl p-6 mb-10 shadow-lg max-w-3xl mx-auto text-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Video className="w-5 h-5 text-blue-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    Upload New Video
                                </h2>
                            </div>

                            {/* Video Upload */}
                            <label className="block">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-blue-500 transition mb-4 cursor-pointer">
                                    {selectedFile ? (
                                        <p className="text-blue-400 font-medium break-words text-center">
                                            {selectedFile.name}
                                        </p>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-blue-400 mb-2" />
                                            <p className="text-sm text-gray-400">
                                                Click to choose a video file
                                            </p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="mt-3 text-sm text-gray-300 hidden"
                                        aria-hidden
                                    />
                                </div>
                            </label>

                            {/* Thumbnail */}
                            <div className="mb-4">
                                <label className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Thumbnail
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="text-sm text-gray-300"
                                />
                            </div>

                            {/* Title */}
                            <div className="mb-4">
                                <label className="text-sm text-gray-400 mb-2 block">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter video title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="text-sm text-gray-400 mb-2 block">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Write a short description..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-2 text-white h-24 resize-none focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Visibility */}
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => setIsPublic((v) => !v)}
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg hover:border-blue-500 transition"
                                >
                                    {isPublic ? (
                                        <>
                                            <Eye className="w-4 h-4 text-green-400" />{" "}
                                            <span>Public</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-4 h-4 text-red-400" />{" "}
                                            <span>Private</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {loading && (
                                <div className="w-full mb-4">
                                    <div className="w-full bg-gray-800 h-2 rounded-full">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Uploading... {uploadProgress}%
                                    </p>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || loading}
                                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                                        loading
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {loading ? "Uploading..." : "Upload Video"}
                                </button>
                            </div>
                        </div>

                        {/* Videos Table */}
                        {videos.length === 0 ? (
                            <div className="text-center text-gray-400 mt-20">
                                <p>No videos available</p>
                                <p>Upload your first video to get started!</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse mb-6">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-2">Video</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Views</th>
                                        <th className="p-2">Comments</th>
                                        <th className="p-2">Likes</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video) => (
                                        <tr
                                            key={video.id}
                                            className="border-b border-gray-700 hover:bg-[#333]"
                                        >
                                            <td className="p-2">
                                                {video.title}
                                            </td>
                                            <td className="p-2">
                                                {video.date}
                                            </td>
                                            <td className="p-2">
                                                {video.views}
                                            </td>
                                            <td className="p-2">
                                                {video.comments}
                                            </td>
                                            <td className="p-2">
                                                {video.likes}
                                            </td>
                                            <td className="p-2 text-blue-400 cursor-pointer">
                                                Add to Playlist
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="">
                        {/* Course Creation Section */}
                        <CreateCourse
                            onSuccess={(course) =>
                                console.log("Created:", course)
                            }
                        />
                        
                        {/* Playlist Section */}
                        <Card className="bg-[#282828] mb-6">
                            <CardHeader>
                                <div className="text-lg font-semibold text-white">
                                    Playlists
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Playlist Name"
                                        value={newPlaylistName}
                                        onChange={(e) =>
                                            setNewPlaylistName(e.target.value)
                                        }
                                        className="p-2 rounded bg-gray-700 text-white w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={newPlaylistDesc}
                                        onChange={(e) =>
                                            setNewPlaylistDesc(e.target.value)
                                        }
                                        className="p-2 rounded bg-gray-700 text-white w-full"
                                    />
                                    <Button
                                        onClick={handleCreatePlaylist}
                                        className="px-8"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        Create
                                    </Button>
                                </div>

                                {playlists.length === 0 ? (
                                    <div className="text-gray-400">
                                        No playlists created yet
                                    </div>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {playlists.map((pl) => (
                                            <li
                                                key={pl.id}
                                                className="flex justify-between items-center p-3 bg-gray-800 rounded hover:bg-gray-700"
                                            >
                                                <div>
                                                    <p className="font-semibold">
                                                        {pl.name}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {pl.description} |{" "}
                                                        {pl.videos.length}{" "}
                                                        videos
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    className="text-blue-400 flex items-center gap-1"
                                                >
                                                    <Edit2 className="w-4 h-4" />{" "}
                                                    Edit
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
