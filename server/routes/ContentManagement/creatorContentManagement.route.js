import express from "express";
import upload from "../../middleware/fileUpload.middleware.js"
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import Video from "../../models/video.model.js";
import Course from "../../models/course.model.js";

const router = express.Router();

// Utility: Convert S3 URL to HLS master.m3u8 URL
function convertToHlsUrl(originalUrl, custom) {
  // Updated regex to match actual S3 URL format: https://s3.ap-south-1.amazonaws.com/bucket-name/videos/userId/videoId.mp4
  const basePattern = /https:\/\/s3\.ap-south-1\.amazonaws\.com\/([^/]+)\/videos\/([^/]+)\/([^/.]+)\.mp4$/;
  const match = originalUrl.match(basePattern);
  console.log("URL being matched:", originalUrl);
  console.log("Regex pattern:", basePattern);

  if (!match) {
    throw new Error("Invalid URL format");
  }

  const bucketName = match[1]; // videos-edusathi.net
  const videoFolder = match[2]; // userId
  const videoId = match[3]; // timestamp

  return `https://s3.ap-south-1.amazonaws.com/${bucketName}/videos/${videoFolder}/${videoId}/hls/master.m3u8`;
}

// Convert boolean-like values safely
function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return false;
}

// Upload a new video (for verified creators)
router.post("/videos/upload", authenticateToken, requireRole(['creator']),
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
  try {
     // --- Validate file upload ---
    if (!req.files || !req.files.videoFile) {
      return res.status(400).json({
        status: false,
        error: "Please upload a video file",
      });
    }

    const videoFile = req.files.videoFile[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    // --- Extract body fields ---
    const {
      title,
      description,
      thumbnail,
      duration,
      quality,
      course,
      isPublic,
      isPremium,
      playlistOrder,
      views,
      likes,
    } = req.body;

    // --- Validate required fields ---
    if (!title || !duration || !course) {
      return res.status(400).json({
        status: false,
        error: "Missing required fields (title, duration, course)",
      });
    }

    // --- Generate HLS streaming URL ---
    const hlsUrl = convertToHlsUrl(videoFile.location, process.env.S3_STORAGE_NAME);
    
    // --- Handle thumbnail URL ---
    const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;

    // --- Create video document ---
    const video = new Video({
      title,
      description,
      videoUrl: hlsUrl,
      thumbnail: thumbnailUrl,
      duration: Number(duration) || 0,
      quality: quality || "720p",
      course,
      creator: req.user.id || req.user._id,
      isPublic: parseBoolean(isPublic),
      isPremium: parseBoolean(isPremium),
      playlistOrder: Number(playlistOrder) || 0,
      views: Number(views) || 0,
      likes: Number(likes) || 0,
    });

    // --- Save document in DB ---
    await video.save();

    // --- Send success response ---
    res.status(200).json({
      status: true,
      message: "Video uploaded and saved successfully!",
      data: video,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Something went wrong during upload",
    });
  }
});

// Get all videos for a creator (with pagination and filters)
router.get("/videos", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const creatorId = req.user.id || req.user._id;
    const {
      page = 1,
      limit = 10,
      course,
      isPublic,
      isPremium,
      sortBy = "createdAt",
      sortOrder = "desc",
      search
    } = req.query;

    // Build filter object
    const filter = { 
      creator: creatorId,
      isActive: { $ne: false } // Only get active videos (not deleted)
    };
    
    if (course) filter.course = course;
    if (isPublic !== undefined) filter.isPublic = parseBoolean(isPublic);
    if (isPremium !== undefined) filter.isPremium = parseBoolean(isPremium);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get videos with pagination
    const videos = await Video.find(filter)
      .populate("course", "title subject grade")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    // Get total count for pagination
    const totalVideos = await Video.countDocuments(filter);
    const totalPages = Math.ceil(totalVideos / parseInt(limit));

    res.status(200).json({
      status: true,
      message: "Videos retrieved successfully",
      data: {
        videos,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalVideos,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error("Get videos error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve videos"
    });
  }
});

// Get single video by ID
router.get("/videos/:id", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id || req.user._id;

    const video = await Video.findOne({ _id: id, creator: creatorId })
      .populate("course", "title subject grade level")
      .populate("creator", "firstName lastName email")
      .select("-__v");

    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found or you don't have permission to access it"
      });
    }

    res.status(200).json({
      status: true,
      message: "Video retrieved successfully",
      data: video
    });
  } catch (error) {
    console.error("Get video error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve video"
    });
  }
});

// Update video details
router.put("/videos/:id", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id || req.user._id;
    
    const {
      title,
      description,
      thumbnail,
      duration,
      quality,
      course,
      isPublic,
      isPremium,
      playlistOrder
    } = req.body;

    // Find video and verify ownership
    const video = await Video.findOne({ _id: id, creator: creatorId });
    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found or you don't have permission to update it"
      });
    }

    // Update fields if provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (duration !== undefined) updateData.duration = Number(duration);
    if (quality !== undefined) updateData.quality = quality;
    if (course !== undefined) updateData.course = course;
    if (isPublic !== undefined) updateData.isPublic = parseBoolean(isPublic);
    if (isPremium !== undefined) updateData.isPremium = parseBoolean(isPremium);
    if (playlistOrder !== undefined) updateData.playlistOrder = Number(playlistOrder);

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("course", "title subject grade");

    res.status(200).json({
      status: true,
      message: "Video updated successfully",
      data: updatedVideo
    });
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to update video"
    });
  }
});

// Delete video (soft delete)
router.delete("/videos/:id", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id || req.user._id;

    // Find video and verify ownership
    const video = await Video.findOne({ _id: id, creator: creatorId });
    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found or you don't have permission to delete it"
      });
    }

    // Soft delete by setting isActive to false
    await Video.findByIdAndUpdate(id, { 
      $set: { 
        isActive: false,
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      status: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to delete video"
    });
  }
});

// Get video analytics
router.get("/videos/:id/analytics", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id || req.user._id;

    const video = await Video.findOne({ _id: id, creator: creatorId })
      .populate("watchTime.student", "firstName lastName email")
      .select("title views likes watchTime createdAt");

    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found or you don't have permission to access it"
      });
    }

    // Calculate analytics
    const totalWatchTime = video.watchTime.reduce((sum, watch) => sum + (watch.timeWatched || 0), 0);
    const uniqueViewers = video.watchTime.length;
    const completionRate = video.watchTime.filter(watch => watch.completed).length / uniqueViewers * 100 || 0;
    const averageWatchTime = uniqueViewers > 0 ? totalWatchTime / uniqueViewers : 0;

    const analytics = {
      videoId: video._id,
      title: video.title,
      totalViews: video.views,
      totalLikes: video.likes,
      uniqueViewers,
      totalWatchTime: Math.round(totalWatchTime),
      averageWatchTime: Math.round(averageWatchTime),
      completionRate: Math.round(completionRate * 100) / 100,
      createdAt: video.createdAt,
      recentViewers: video.watchTime.slice(-10) // Last 10 viewers
    };

    res.status(200).json({
      status: true,
      message: "Video analytics retrieved successfully",
      data: analytics
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve video analytics"
    });
  }
});

// Increment video views
router.post("/videos/:id/view", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).select("views title");

    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "View count updated",
      data: { views: video.views }
    });
  } catch (error) {
    console.error("Update views error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to update view count"
    });
  }
});

export default router;
