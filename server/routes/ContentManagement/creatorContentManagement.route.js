import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import upload from "../../middleware/fileUpload.middleware.js"
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import Video from "../../models/video.model.js";
import Course from "../../models/course.model.js";

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const router = express.Router();


// Public endpoint to get all courses from all creators
router.get("/public/courses", async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('creator', 'name email') // Populate creator info
      .sort({ createdAt: -1 }); // Sort by newest first

    const formattedCourses = courses.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      grade: course.grade,
      level: course.level,
      thumbnail: course.thumbnail,
      isPaid: course.isPaid,
      price: course.price,
      creator: {
        _id: course.creator._id,
        name: course.creator.name,
        email: course.creator.email
      },
      playlistCount: course.playlists?.length || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    res.status(200).json({
      status: true,
      message: "All courses retrieved successfully",
      data: {
        courses: formattedCourses,
        total: formattedCourses.length
      }
    });

  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve courses"
    });
  }
});

// Public endpoint to get course by ID with detailed information
router.get("/public/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('creator', 'name email profilePicture bio totalStudents totalCourses rating')
      .populate({
        path: 'playlists.videos',
        select: 'title description duration thumbnail isPremium'
      });

    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found"
      });
    }

    // Format course data with detailed information
    const formattedCourse = {
      _id: course._id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      grade: course.grade,
      level: course.level,
      thumbnail: course.thumbnail,
      isPaid: course.isPaid,
      price: course.price,
      originalPrice: course.originalPrice || course.price * 1.5, // Mock original price
      creator: {
        _id: course.creator._id,
        name: course.creator.name,
        email: course.creator.email,
        profilePicture: course.creator.profilePicture,
        bio: course.creator.bio,
        totalStudents: course.creator.totalStudents || 0,
        totalCourses: course.creator.totalCourses || 1,
        rating: course.creator.rating || 4.7
      },
      playlists: course.playlists?.map(playlist => ({
        _id: playlist._id,
        title: playlist.title,
        description: playlist.description,
        order: playlist.order,
        videoCount: playlist.videos?.length || 0,
        totalDuration: `${(playlist.videos?.length || 0) * 15} mins`, // Mock duration
        videos: playlist.videos?.map(video => ({
          _id: video._id,
          title: video.title,
          description: video.description,
          duration: video.duration || '15 mins',
          thumbnail: video.thumbnail,
          isPremium: video.isPremium,
          isLocked: course.isPaid && video.isPremium
        }))
      })) || [],
      stats: {
        totalStudents: Math.floor(Math.random() * 50000) + 10000, // Mock stats
        totalReviews: Math.floor(Math.random() * 5000) + 1000,
        averageRating: 4.7,
        totalDuration: `${(course.playlists?.length || 1) * 5} hours`,
        lastUpdated: course.updatedAt
      },
      features: [
        "Comprehensive learning experience",
        "Hands-on projects and exercises",
        "Expert instructor guidance",
        "Certificate of completion",
        "Lifetime access to course materials",
        "Mobile and desktop access"
      ],
      requirements: [
        "Basic computer skills",
        "Internet connection",
        "Willingness to learn"
      ],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };

    res.status(200).json({
      status: true,
      message: "Course details retrieved successfully",
      data: {
        course: formattedCourse
      }
    });

  } catch (error) {
    console.error("Get course by ID error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve course details"
    });
  }
});

// Utility: Convert S3 MP4 URL → proper HLS master.m3u8 URL
function convertToHlsUrl(originalUrl) {
  if (!originalUrl) return originalUrl;

  // Match both S3 URL formats:
  // 1. https://videos-edusathi.net.s3.ap-south-1.amazonaws.com/videos/<userId>/<videoId>.mp4
  // 2. https://s3.ap-south-1.amazonaws.com/videos-edusathi.net/videos/<userId>/<videoId>.mp4
  const pattern =
    /^https:\/\/(?:([a-zA-Z0-9.-]+)\.s3\.ap-south-1\.amazonaws\.com|s3\.ap-south-1\.amazonaws\.com\/([a-zA-Z0-9.-]+))\/videos\/([^/]+)\/([^/.]+)\.mp4$/;

  const match = originalUrl.match(pattern);
  if (!match) return originalUrl; // Leave as-is if it doesn’t match

  const bucketName = match[1] || match[2];
  const userId = match[3];
  const videoId = match[4];

  return `https://s3.ap-south-1.amazonaws.com/${process.env.S3_STORAGE_NAME}/videos/${userId}/${videoId}/hls/master.m3u8`;
}

// Helper: convert string boolean safely
function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return false;
}


// create a new course (for verified creators).............
router.post(
    "/courses/create",
    authenticateToken,
    requireRole(["creator"]),
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "previewVideo", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const creatorId = req.user._id || req.user.sub;

            const {
                title,
                description,
                shortDescription,
                subject,
                grade,
                level,
                isPaid,
                price,
                originalPrice,
                currency,
                maxStudents,
                duration,
                language,
                difficulty,
                category,
                tags,
                features,
                requirements,
                targetAudience,
                learningOutcomes,
                isPublished
            } = req.body;

            // Validate required fields
            if (!title || !description || !subject || !grade || !level) {
                return res.status(400).json({
                    status: false,
                    error: "Missing required fields: title, description, subject, grade, level",
                });
            }

            // Handle file uploads
            let thumbnailUrl = null;
            let previewVideoUrl = null;

            // Process thumbnail upload
            if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
                const thumbnailFile = req.files.thumbnail[0];
                
                // Generate unique filename
                const thumbnailExtension = path.extname(thumbnailFile.originalname);
                const thumbnailFilename = `course-thumbnail-${Date.now()}-${Math.random().toString(36).substring(7)}${thumbnailExtension}`;
                
                // Check if file was uploaded to S3 via middleware
                if (thumbnailFile.location) {
                    // File was uploaded to S3 by middleware
                    thumbnailUrl = thumbnailFile.location;
                } else if (thumbnailFile.buffer) {
                    // Upload to S3 directly or save locally
                    if (process.env.AWS_S3_BUCKET) {
                        // S3 Upload using AWS SDK v3
                        const uploadParams = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Key: `course-thumbnails/${creatorId}/${thumbnailFilename}`,
                            Body: thumbnailFile.buffer,
                            ContentType: thumbnailFile.mimetype,
                        };
                        
                        const s3Upload = new Upload({
                            client: s3Client,
                            params: uploadParams,
                        });
                        
                        const s3Result = await s3Upload.done();
                        thumbnailUrl = s3Result.Location;
                    } else {
                        // Local storage fallback
                        const uploadDir = path.join(__dirname, '../../uploads/course-thumbnails');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        
                        const thumbnailPath = path.join(uploadDir, thumbnailFilename);
                        fs.writeFileSync(thumbnailPath, thumbnailFile.buffer);
                        thumbnailUrl = `/uploads/course-thumbnails/${thumbnailFilename}`;
                    }
                }
            }

            // Process preview video upload
            if (req.files && req.files.previewVideo && req.files.previewVideo[0]) {
                const videoFile = req.files.previewVideo[0];
                
                // Generate unique filename
                const videoExtension = path.extname(videoFile.originalname);
                const videoFilename = `course-preview-${Date.now()}-${Math.random().toString(36).substring(7)}${videoExtension}`;
                
                // Check if file was uploaded to S3 via middleware
                if (videoFile.location) {
                    // File was uploaded to S3 by middleware
                    previewVideoUrl = videoFile.location;
                } else if (videoFile.buffer) {
                    // Upload to S3 directly or save locally
                    if (process.env.AWS_S3_BUCKET) {
                        // S3 Upload using AWS SDK v3
                        const uploadParams = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Key: `course-previews/${creatorId}/${videoFilename}`,
                            Body: videoFile.buffer,
                            ContentType: videoFile.mimetype,
                        };
                        
                        const s3Upload = new Upload({
                            client: s3Client,
                            params: uploadParams,
                        });
                        
                        const s3Result = await s3Upload.done();
                        previewVideoUrl = s3Result.Location;
                    } else {
                        // Local storage fallback
                        const uploadDir = path.join(__dirname, '../../uploads/course-previews');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        
                        const videoPath = path.join(uploadDir, videoFilename);
                        fs.writeFileSync(videoPath, videoFile.buffer);
                        previewVideoUrl = `/uploads/course-previews/${videoFilename}`;
                    }
                }
            }

            // Parse JSON fields if they're strings
            const parsedTags = typeof tags === 'string' ? JSON.parse(tags || '[]') : (tags || []);
            const parsedFeatures = typeof features === 'string' ? JSON.parse(features || '[]') : (features || []);
            const parsedRequirements = typeof requirements === 'string' ? JSON.parse(requirements || '[]') : (requirements || []);
            const parsedTargetAudience = typeof targetAudience === 'string' ? JSON.parse(targetAudience || '[]') : (targetAudience || []);
            const parsedLearningOutcomes = typeof learningOutcomes === 'string' ? JSON.parse(learningOutcomes || '[]') : (learningOutcomes || []);

            // Create new course with enhanced fields
            const course = new Course({
                title,
                description,
                shortDescription,
                subject,
                grade,
                level,
                thumbnail: thumbnailUrl,
                previewVideo: previewVideoUrl,
                creator: creatorId,
                isPaid: isPaid === 'true' || isPaid === true,
                price: (isPaid === 'true' || isPaid === true) ? (Number(price) || 0) : 0,
                originalPrice: Number(originalPrice) || null,
                currency: currency || "INR",
                maxStudents: Number(maxStudents) || null,
                duration: Number(duration) || 0,
                language: language || "English",
                difficulty: difficulty || "Beginner",
                category: category || "General",
                tags: parsedTags,
                features: parsedFeatures,
                requirements: parsedRequirements,
                targetAudience: parsedTargetAudience,
                learningOutcomes: parsedLearningOutcomes,
                playlists: [], // Initialize empty playlists array
                isPublished: isPublished === 'true' || isPublished === true || false,
                enrollmentCount: 0,
                averageRating: 0,
                totalReviews: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await course.save();

            res.status(201).json({
                status: true,
                message: "Course created successfully",
                data: {
                    course: course,
                    thumbnailUrl: thumbnailUrl,
                    previewVideoUrl: previewVideoUrl
                },
            });
        } catch (error) {
            console.error("Create course error:", error);
            res.status(500).json({
                status: false,
                error: error.message || "Failed to create course",
            });
        }
    }
);

// Get all courses for a creator (with pagination and filters)
router.get(
    "/courses",
    authenticateToken,
    requireRole(["creator"]),
    async (req, res) => {
        try {
            const creatorId = req.user._id || req.user.sub;
            const {
                page = 1,
                limit = 10,
                subject,
                grade,
                level,
                isPaid,
                isPublished,
                sortBy = "createdAt",
                sortOrder = "desc",
                search,
            } = req.query;

            // Build filter object
            const filter = {
                creator: creatorId,
                isActive: { $ne: false }, // Only active courses
            };

            if (subject) filter.subject = subject;
            if (grade) filter.grade = grade;
            if (level) filter.level = level;
            if (isPaid !== undefined) filter.isPaid = parseBoolean(isPaid);
            if (isPublished !== undefined)
                filter.isPublished = parseBoolean(isPublished);

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { shortDescription: { $regex: search, $options: "i" } },
                ];
            }

            // Calculate pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

            // Get courses with pagination
            const courses = await Course.find(filter)
                .populate("creator", "firstName lastName email")
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .select("-__v");

            // Get total count for pagination
            const totalCourses = await Course.countDocuments(filter);
            const totalPages = Math.ceil(totalCourses / parseInt(limit));

            res.status(200).json({
                status: true,
                message: "Courses retrieved successfully",
                data: {
                    courses,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalCourses,
                        hasNextPage: parseInt(page) < totalPages,
                        hasPrevPage: parseInt(page) > 1,
                    },
                },
            });
        } catch (error) {
            console.error("Get courses error:", error);
            res.status(500).json({
                status: false,
                error: error.message || "Failed to retrieve courses",
            });
        }
    }
);

// Get particular course by ID.............
router.get(
    "/courses/:id",
    authenticateToken,
    requireRole(["creator"]),
    async (req, res) => {
        try {
            const { id } = req.params;
            const creatorId = req.user._id || req.user.sub;

            const course = await Course.findOne({ _id: id, creator: creatorId })
                .populate("creator", "firstName lastName email profilePicture")
                .populate(
                    "playlists.videos",
                    "title duration thumbnail videoUrl"
                )
                .populate("notes", "title fileType createdAt")
                .populate("tests", "title totalQuestions totalMarks createdAt")
                .select("-__v");

            if (!course) {
                return res.status(404).json({
                    status: false,
                    error: "Course not found or you don't have permission to access it",
                });
            }

            res.status(200).json({
                status: true,
                message: "Course retrieved successfully",
                data: course,
            });
        } catch (error) {
            console.error("Get course error:", error);
            res.status(500).json({
                status: false,
                error: error.message || "Failed to retrieve course",
            });
        }
    }
);

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
    if (!title || !duration) {
      return res.status(400).json({
        status: false,
        error: "Missing required fields (title, duration)",
      });
    }

    // --- Generate HLS streaming URL ---
    const hlsUrl = convertToHlsUrl(videoFile.location, process.env.S3_STORAGE_NAME);
    console.log(hlsUrl);
    
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
      course: course || null,
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

router.get("/all-videos", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            course,
            isPublic,
            isPremium,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            creator,
        } = req.query;

        const filter = { isActive: { $ne: false } };

        if (course) filter.course = course;
        if (isPublic !== undefined) filter.isPublic = parseBoolean(isPublic);
        if (isPremium !== undefined) filter.isPremium = parseBoolean(isPremium);
        if (creator) filter.creator = creator;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

        const videos = await Video.find(filter)
            .populate("course")
            .populate("creator", "firstName lastName email profilePicture")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .select("-__v");

        //  Convert all stored .mp4 links → HLS .m3u8 format
        videos.forEach((video) => {
            if (video.videoUrl && video.videoUrl.endsWith(".mp4")) {
                video.videoUrl = convertToHlsUrl(video.videoUrl);
            }
        });

        const totalVideos = await Video.countDocuments(filter);
        const totalPages = Math.ceil(totalVideos / parseInt(limit));
        console.log(videos);

        res.status(200).json({
            status: true,
            message: "All videos retrieved successfully",
            data: {
                videos,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalVideos,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                },
            },
        });
    } catch (error) {
        console.error("Get all videos error:", error);
        res.status(500).json({
            status: false,
            error: error.message || "Failed to retrieve all videos",
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

// Create playlist in a course
router.post("/courses/:courseId/playlists", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const creatorId = req.user._id || req.user.sub;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        status: false,
        error: "Playlist title is required"
      });
    }

    // Find course and verify ownership
    const course = await Course.findOne({ _id: courseId, creator: creatorId });
    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found or you don't have permission"
      });
    }

    // Create new playlist
    const newPlaylist = {
      title: title.trim(),
      description: description?.trim() || "",
      videos: [],
      order: course.playlists.length + 1
    };

    // Add playlist to course
    course.playlists.push(newPlaylist);
    await course.save();

    res.status(201).json({
      status: true,
      message: "Playlist created successfully",
      data: {
        playlist: newPlaylist,
        course: course
      }
    });

  } catch (error) {
    console.error("Create playlist error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to create playlist"
    });
  }
});

// Get all playlists for a course
router.get("/courses/:courseId/playlists", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const creatorId = req.user._id || req.user.sub;

    // Find course and verify ownership
    const course = await Course.findOne({ _id: courseId, creator: creatorId })
      .populate("playlists.videos", "title duration thumbnail videoUrl");
    
    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found or you don't have permission"
      });
    }

    res.status(200).json({
      status: true,
      message: "Playlists retrieved successfully",
      data: {
        playlists: course.playlists,
        courseTitle: course.title
      }
    });

  } catch (error) {
    console.error("Get playlists error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to retrieve playlists"
    });
  }
});

// Add video to playlist
router.post("/courses/:courseId/playlists/:playlistId/videos", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { courseId, playlistId } = req.params;
    const { videoId } = req.body;
    const creatorId = req.user._id || req.user.sub;

    // Validate required fields
    if (!videoId) {
      return res.status(400).json({
        status: false,
        error: "Video ID is required"
      });
    }

    // Find course and verify ownership
    const course = await Course.findOne({ _id: courseId, creator: creatorId });
    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found or you don't have permission"
      });
    }

    // Find the specific playlist
    const playlist = course.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({
        status: false,
        error: "Playlist not found"
      });
    }

    // Check if video exists and belongs to creator
    const video = await Video.findOne({ _id: videoId, creator: creatorId });
    if (!video) {
      return res.status(404).json({
        status: false,
        error: "Video not found or you don't have permission"
      });
    }

    // Check if video is already in playlist
    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({
        status: false,
        error: "Video is already in this playlist"
      });
    }

    // Add video to playlist
    playlist.videos.push(videoId);
    await course.save();

    // Update video's course reference if not set
    if (!video.course) {
      video.course = courseId;
      await video.save();
    }

    res.status(200).json({
      status: true,
      message: "Video added to playlist successfully",
      data: {
        playlist: playlist,
        video: video
      }
    });

  } catch (error) {
    console.error("Add video to playlist error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to add video to playlist"
    });
  }
});

// Remove video from playlist
router.delete("/courses/:courseId/playlists/:playlistId/videos/:videoId", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { courseId, playlistId, videoId } = req.params;
    const creatorId = req.user._id || req.user.sub;

    // Find course and verify ownership
    const course = await Course.findOne({ _id: courseId, creator: creatorId });
    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found or you don't have permission"
      });
    }

    // Find the specific playlist
    const playlist = course.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({
        status: false,
        error: "Playlist not found"
      });
    }

    // Remove video from playlist
    playlist.videos.pull(videoId);
    await course.save();

    res.status(200).json({
      status: true,
      message: "Video removed from playlist successfully",
      data: {
        playlist: playlist
      }
    });

  } catch (error) {
    console.error("Remove video from playlist error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to remove video from playlist"
    });
  }
});

// Update video order in playlist
router.put("/courses/:courseId/playlists/:playlistId/videos/reorder", authenticateToken, requireRole(['creator']), async (req, res) => {
  try {
    const { courseId, playlistId } = req.params;
    const { videoOrder } = req.body; // Array of video IDs in new order
    const creatorId = req.user._id || req.user.sub;

    // Validate required fields
    if (!videoOrder || !Array.isArray(videoOrder)) {
      return res.status(400).json({
        status: false,
        error: "Video order array is required"
      });
    }

    // Find course and verify ownership
    const course = await Course.findOne({ _id: courseId, creator: creatorId });
    if (!course) {
      return res.status(404).json({
        status: false,
        error: "Course not found or you don't have permission"
      });
    }

    // Find the specific playlist
    const playlist = course.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({
        status: false,
        error: "Playlist not found"
      });
    }

    // Update video order
    playlist.videos = videoOrder;
    await course.save();

    res.status(200).json({
      status: true,
      message: "Video order updated successfully",
      data: {
        playlist: playlist
      }
    });

  } catch (error) {
    console.error("Update video order error:", error);
    res.status(500).json({
      status: false,
      error: error.message || "Failed to update video order"
    });
  }
});

export default router;
