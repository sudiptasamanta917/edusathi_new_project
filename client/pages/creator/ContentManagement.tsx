import React, { useState, useEffect } from "react";
import { Upload, Edit2, PlusCircle } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Sidebar from "./SideBar";

interface Video {
    id: number;
    title: string;
    date: string;
    views: number;
    comments: number;
    likes: number;
}

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

    // Fetch videos & playlists from backend API
    useEffect(() => {
        // Replace with real API calls later
        // Example:
        // fetch("/api/videos").then(res => res.json()).then(setVideos);
        // fetch("/api/playlists").then(res => res.json()).then(setPlaylists);
        setVideos([]); // initial empty
        setPlaylists([]);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // Placeholder for API call
        // const formData = new FormData();
        // formData.append("video", selectedFile);
        // const res = await fetch("/api/upload", { method: "POST", body: formData });
        // const newVideo = await res.json();

        const newVideo: Video = {
            id: videos.length + 1,
            title: selectedFile.name,
            date: new Date().toLocaleDateString(),
            views: 0,
            comments: 0,
            likes: 0,
        };

        setVideos([newVideo, ...videos]);
        setSelectedFile(null);
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
                <h1 className="text-2xl font-bold mb-6">Content Management</h1>

                <div className="grid grid-cols-2 gap-6">
                    <div className="">
                        {/* Upload Card */}
                        <Card className="bg-[#282828] mb-6 border">
                            <CardHeader>
                                <div className="text-white font-semibold text-lg">
                                    Upload New Video
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                                <Upload className="w-12 h-12 text-blue-400" />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="text-sm text-gray-300"
                                />
                                <Button
                                    onClick={handleUpload}
                                    disabled={!selectedFile}
                                >
                                    Upload Video
                                </Button>
                            </CardContent>
                        </Card>

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
                        {/* Playlist Section */}
                        <Card className="bg-[#282828] mb-6">
                            <CardHeader>
                                <div className="text-lg font-semibold text-white">Playlists</div>
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
                                    <Button onClick={handleCreatePlaylist} className="px-8">
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
