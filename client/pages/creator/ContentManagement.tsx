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
import { CourseAPI } from "@/Api/api";

interface Video {
    id: number;
    title: string;
    date: string;
    views: number;
    comments: number;
    likes: number;
}

interface Course {
    _id?: string;
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
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPaid, setIsPaid] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedcourse, setSelectedcourse] = useState<any[]>([]);
    const [selectedCourseForPlaylist, setSelectedCourseForPlaylist] = useState<string>("");

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
                        _id: v._id, // Add video _id for playlist operations
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

    const fetchCourses = async () => {
        try {
            console.log("Fetching courses...");
            const res = await CourseAPI.getCourses();
            console.log("Course API response:", res);
            if (res.status && res.data?.courses) {
                console.log("Setting courses:", res.data.courses);
                setCourses(res.data.courses);
            } else {
                console.error(
                    "Failed to fetch courses:",
                    res.error || res.message
                );
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Playlist functions
    const fetchPlaylists = async (courseId: string) => {
        try {
            console.log("Fetching playlists for course:", courseId);
            const res = await CourseAPI.getPlaylists(courseId);
            console.log("Playlist API response:", res);
            if (res.status && res.data?.playlists) {
                setPlaylists(res.data.playlists);
            } else {
                console.error("Failed to fetch playlists:", res.error || res.message);
                setPlaylists([]);
            }
        } catch (err) {
            console.error("Error fetching playlists:", err);
            setPlaylists([]);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!selectedCourseForPlaylist) {
            alert("Please select a course first");
            return;
        }
        if (!newPlaylistName.trim()) {
            alert("Please enter a playlist name");
            return;
        }

        try {
            const playlistData = {
                title: newPlaylistName.trim(),
                description: newPlaylistDesc.trim()
            };

            console.log("Creating playlist:", playlistData);
            const res = await CourseAPI.createPlaylist(selectedCourseForPlaylist, playlistData);
            console.log("Create playlist response:", res);

            if (res.status) {
                alert("Playlist created successfully!");
                setNewPlaylistName("");
                setNewPlaylistDesc("");
                // Refresh playlists for the selected course
                fetchPlaylists(selectedCourseForPlaylist);
            } else {
                alert(res.error || "Failed to create playlist");
            }
        } catch (error: any) {
            console.error("Error creating playlist:", error);
            alert(`Error creating playlist: ${error.message || "Unknown error"}`);
        }
    };

    // Fetch playlists when course selection changes
    useEffect(() => {
        if (selectedCourseForPlaylist) {
            fetchPlaylists(selectedCourseForPlaylist);
        } else {
            setPlaylists([]);
        }
    }, [selectedCourseForPlaylist]);

    // Add video to playlist function
    const handleAddVideoToPlaylist = async (videoId: string, playlistId: string) => {
        if (!selectedCourseForPlaylist) {
            alert("Please select a course first");
            return;
        }

        const selectedPlaylist = playlists.find(p => p._id === playlistId);
        if (!selectedPlaylist) {
            alert("Playlist not found");
            return;
        }

        try {
            console.log("Adding video to playlist:", {
                courseId: selectedCourseForPlaylist,
                playlistId: selectedPlaylist._id,
                videoId: videoId,
                playlistTitle: selectedPlaylist.title
            });

            const res = await CourseAPI.addVideoToPlaylist(
                selectedCourseForPlaylist,
                selectedPlaylist._id,
                videoId
            );

            console.log("Add video to playlist response:", res);

            if (res.status) {
                alert(`Video added to "${selectedPlaylist.title}" successfully!`);
                // Refresh playlists to show updated video count
                fetchPlaylists(selectedCourseForPlaylist);
            } else {
                alert(res.error || "Failed to add video to playlist");
            }
        } catch (error: any) {
            console.error("Error adding video to playlist:", error);
            alert(`Error: ${error.message || "Unknown error"}`);
        }
    };

    // Move video up/down in playlist
    const handleMoveVideo = async (playlistId: string, videoIndex: number, direction: 'up' | 'down') => {
        const playlist = playlists.find(p => p._id === playlistId);
        if (!playlist || !playlist.videos) return;

        const newVideos = [...playlist.videos];
        const newIndex = direction === 'up' ? videoIndex - 1 : videoIndex + 1;

        // Check bounds
        if (newIndex < 0 || newIndex >= newVideos.length) return;

        // Swap videos
        [newVideos[videoIndex], newVideos[newIndex]] = [newVideos[newIndex], newVideos[videoIndex]];

        try {
            // Get video IDs for API call
            const videoOrder = newVideos.map(video => video._id || video);

            const res = await CourseAPI.updateVideoOrder(
                selectedCourseForPlaylist,
                playlistId,
                videoOrder
            );

            if (res.status) {
                // Refresh playlists to show updated order
                fetchPlaylists(selectedCourseForPlaylist);
            } else {
                alert(res.error || "Failed to update video order");
            }
        } catch (error: any) {
            console.error("Error updating video order:", error);
            alert(`Error: ${error.message || "Unknown error"}`);
        }
    };

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
                alert(" Video uploaded successfully!");
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
                alert(` Upload failed: ${result.error || result.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(" Something went wrong during upload. Please check your login status.");
        } finally {
            setLoading(false);
        }
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
                            <>
                                {/* Playlist Selection Status */}
                                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-white font-medium">Playlist Selection Status</h3>
                                        {selectedCourseForPlaylist && (
                                            <span className="text-green-400 text-sm">✓ Course Selected</span>
                                        )}
                                    </div>
                                    
                                    {!selectedCourseForPlaylist ? (
                                        <div className="text-yellow-400 text-sm">
                                            ⚠️ <strong>No course selected.</strong> Please select a course in the Playlist section below to enable video-to-playlist adding.
                                        </div>
                                    ) : playlists.length === 0 ? (
                                        <div className="text-orange-400 text-sm">
                                            📝 <strong>Course:</strong> {courses.find(c => c._id === selectedCourseForPlaylist)?.title}<br/>
                                            ⚠️ <strong>No playlists available.</strong> Create a playlist first to add videos.
                                        </div>
                                    ) : (
                                        <div className="text-green-400 text-sm">
                                            <div className="mb-2">
                                                📚 <strong>Course:</strong> {courses.find(c => c._id === selectedCourseForPlaylist)?.title}
                                            </div>
                                            <div>
                                                📋 <strong>Available Playlists ({playlists.length}):</strong>
                                                <div className="mt-1 grid grid-cols-2 gap-2">
                                                    {playlists.map((playlist, index) => (
                                                        <div key={playlist._id} className="bg-gray-700 px-2 py-1 rounded text-xs">
                                                            {index + 1}. {playlist.title} ({playlist.videos?.length || 0} videos)
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
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
                                            <td className="p-2">
                                                {selectedCourseForPlaylist && playlists.length > 0 ? (
                                                    <select
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                console.log("Video object:", video);
                                                                console.log("Video ID:", video._id);
                                                                if (!video._id) {
                                                                    alert("Video ID is missing!");
                                                                    return;
                                                                }
                                                                handleAddVideoToPlaylist(video._id, e.target.value);
                                                                e.target.value = ""; // Reset selection
                                                            }
                                                        }}
                                                        className="text-sm px-3 py-2 bg-gray-700 text-white border border-blue-400 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                                        defaultValue=""
                                                    >
                                                        <option value="" className="bg-gray-800">
                                                            ➕ Add to Playlist
                                                        </option>
                                                        {playlists.map((playlist, index) => (
                                                            <option key={playlist._id} value={playlist._id} className="bg-gray-800">
                                                                📋 {playlist.title} ({playlist.videos?.length || 0} videos)
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="text-center">
                                                        <button
                                                            className="text-gray-500 cursor-not-allowed text-xs px-2 py-1 border border-gray-500 rounded bg-gray-800"
                                                            disabled
                                                            title={!selectedCourseForPlaylist ? "Select a course first" : "Create playlists first"}
                                                        >
                                                            {!selectedCourseForPlaylist ? "Select Course" : "No Playlists"}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </>
                        )}
                    </div>

                    <div className="">
                        {/* Course Creation Section */}
                        <CreateCourse
                            onSuccess={(course) => {
                                console.log("Created:", course);
                                fetchCourses(); // Refresh course list after creation
                            }}
                        />

                        {/* Playlist Section */}
                        <Card className="bg-[#282828] mb-6">
                            <CardHeader>
                                <div className="text-lg font-semibold text-white">
                                    Playlists
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Course Selection */}
                                <div className="mb-4">
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Select Course for Playlist:
                                    </label>
                                    <select
                                        value={selectedCourseForPlaylist}
                                        onChange={(e) => setSelectedCourseForPlaylist(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    >
                                        <option value="">-- Select a Course --</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Playlist Creation Form */}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Playlist Name"
                                        value={newPlaylistName}
                                        onChange={(e) =>
                                            setNewPlaylistName(e.target.value)
                                        }
                                        className="p-2 rounded bg-gray-700 text-white flex-1"
                                        disabled={!selectedCourseForPlaylist}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        value={newPlaylistDesc}
                                        onChange={(e) =>
                                            setNewPlaylistDesc(e.target.value)
                                        }
                                        className="p-2 rounded bg-gray-700 text-white flex-1"
                                        disabled={!selectedCourseForPlaylist}
                                    />
                                    <Button
                                        onClick={handleCreatePlaylist}
                                        className="px-6"
                                        disabled={!selectedCourseForPlaylist || !newPlaylistName.trim()}
                                    >
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Create
                                    </Button>
                                </div>

                                {/* Playlist Display */}
                                {selectedCourseForPlaylist && (
                                    <div className="mt-4">
                                        <h4 className="text-white font-medium mb-2">
                                            Playlists for: {courses.find(c => c._id === selectedCourseForPlaylist)?.title}
                                        </h4>
                                        {playlists.length === 0 ? (
                                            <div className="text-gray-400 text-center py-4">
                                                No playlists created yet for this course
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {playlists.map((playlist, index) => (
                                                    <div
                                                        key={playlist._id || index}
                                                        className="bg-gray-700 p-4 rounded-lg"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h5 className="text-white font-semibold text-lg mb-1">
                                                                    {playlist.title}
                                                                </h5>
                                                                {playlist.description && (
                                                                    <p className="text-gray-300 text-sm mb-2">
                                                                        {playlist.description}
                                                                    </p>
                                                                )}
                                                                <div className="flex gap-4 text-xs text-gray-400">
                                                                    <span>Videos: {playlist.videos?.length || 0}</span>
                                                                    <span>Order: {playlist.order || index + 1}</span>
                                                                </div>
                                                                {/* Show video list if available */}
                                                                {playlist.videos && playlist.videos.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <p className="text-xs text-gray-500 mb-1">Videos in this playlist (drag to reorder):</p>
                                                                        <div className="text-xs text-gray-400 space-y-1">
                                                                            {playlist.videos.map((video: any, vIndex: number) => (
                                                                                <div key={vIndex} className="flex items-center justify-between bg-gray-600 p-2 rounded">
                                                                                    <div className="flex items-center gap-2 flex-1">
                                                                                        <span className="text-gray-500 font-mono text-xs">
                                                                                            {vIndex + 1}.
                                                                                        </span>
                                                                                        <span className="flex-1">
                                                                                            {video.title || `Video ${vIndex + 1}`}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        {/* Move Up Button */}
                                                                                        <button
                                                                                            onClick={() => handleMoveVideo(playlist._id, vIndex, 'up')}
                                                                                            disabled={vIndex === 0}
                                                                                            className={`p-1 rounded text-xs ${
                                                                                                vIndex === 0 
                                                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                                                    : 'text-blue-400 hover:text-blue-300 hover:bg-gray-500'
                                                                                            }`}
                                                                                            title="Move up"
                                                                                        >
                                                                                            ↑
                                                                                        </button>
                                                                                        {/* Move Down Button */}
                                                                                        <button
                                                                                            onClick={() => handleMoveVideo(playlist._id, vIndex, 'down')}
                                                                                            disabled={vIndex === playlist.videos.length - 1}
                                                                                            className={`p-1 rounded text-xs ${
                                                                                                vIndex === playlist.videos.length - 1 
                                                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                                                    : 'text-blue-400 hover:text-blue-300 hover:bg-gray-500'
                                                                                            }`}
                                                                                            title="Move down"
                                                                                        >
                                                                                            ↓
                                                                                        </button>
                                                                                        {/* Remove Button */}
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                if (confirm("Remove this video from playlist?")) {
                                                                                                    // TODO: Implement remove video functionality
                                                                                                    console.log("Remove video:", video._id);
                                                                                                }
                                                                                            }}
                                                                                            className="text-red-400 hover:text-red-300 text-xs p-1 rounded hover:bg-gray-500"
                                                                                            title="Remove from playlist"
                                                                                        >
                                                                                            ✕
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
