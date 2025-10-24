import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Content from '../models/Content.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/course.model.js';
import CourseOrder from '../models/CourseOrder.js';
import Video from '../models/video.model.js';
import Student from '../models/Student.js';
import Creator from '../models/creator.model.js';
import Business from '../models/Business.js';
import Admin from '../models/Admin.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export const createStudentOrder = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { items } = req.body || {};
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!items || !items.length) return res.status(400).json({ message: 'No items' });

    const ids = items.map((i) => i.contentId);
    const contents = await Content.find({ _id: { $in: ids } });
    if (contents.length !== ids.length) return res.status(400).json({ message: 'Some contents not found' });

    const amountRupees = contents.reduce((sum, c) => sum + (c.price || 0), 0);
    const amountPaise = Math.max(1, Math.round(amountRupees * 100));

    const receipt = `stud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const rpOrder = await razorpay.orders.create({ amount: amountPaise, currency: 'INR', receipt });

    const order = await Order.create({
      userId,
      items: ids.map((id) => ({ contentId: id })),
      amount: amountPaise,
      currency: 'INR',
      status: 'created',
      razorpay_order_id: rpOrder.id,
    });

    res.json({
      success: true,
      order: { id: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, receipt: rpOrder.receipt },
      serverOrderId: order._id,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    });
  } catch (err) {
    console.error('createStudentOrder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyStudentPayment = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body || {};

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { status: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid', razorpay_order_id, razorpay_payment_id },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    for (const it of order.items) {
      try {
        await Enrollment.create({ userId: order.userId, contentId: it.contentId, orderId: order._id });
      } catch (_e) {
        // ignore duplicate errors
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('verifyStudentPayment error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const enrollments = await Enrollment.find({ userId }).populate('contentId');
    const items = enrollments.map((en) => {
      const c = en.contentId;
      return {
        enrollmentId: en._id,
        content: {
          id: c._id,
          title: c.title,
          description: c.description,
          type: c.type,
          price: c.price,
          businessName: c.businessName,
          resourceUrl: c.resourceUrl,
          liveLink: c.liveLink,
        },
      };
    });

    res.json({ items });
  } catch (err) {
    console.error('getMyEnrollments error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a Razorpay order for course purchases (student)
export const createStudentCourseOrder = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { courses } = req.body || {};
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!courses || !courses.length) return res.status(400).json({ message: 'No courses' });

    const ids = courses.map((c) => c.courseId);
    const foundCourses = await Course.find({ _id: { $in: ids }, isActive: { $ne: false } });
    if (foundCourses.length !== ids.length) return res.status(400).json({ message: 'Some courses not found' });

    const amountRupees = foundCourses.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
    const amountPaise = Math.max(1, Math.round(amountRupees * 100));

    const receipt = `crs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const rpOrder = await razorpay.orders.create({ amount: amountPaise, currency: 'INR', receipt });

    const order = await CourseOrder.create({
      userId,
      items: ids.map((id) => ({ courseId: id })),
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      status: 'created',
      razorpay_order_id: rpOrder.id,
    });

    res.json({
      success: true,
      order: { id: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, receipt: rpOrder.receipt },
      serverOrderId: order._id,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    });
  } catch (err) {
    console.error('createStudentCourseOrder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify Razorpay payment for course purchases and enroll student to the courses
export const verifyStudentCoursePayment = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body || {};
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await CourseOrder.findByIdAndUpdate(orderId, { status: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await CourseOrder.findByIdAndUpdate(
      orderId,
      { status: 'paid', razorpay_order_id, razorpay_payment_id },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    // Enroll user into each course via Course.enrolledStudents
    for (const it of order.items) {
      try {
        await Course.findByIdAndUpdate(
          it.courseId,
          {
            $addToSet: {
              enrolledStudents: { student: order.userId, enrolledAt: new Date(), progress: 0 },
            },
            $inc: { totalEnrollments: 1, enrollmentCount: 1 },
          }
        );
      } catch (_e) {
        // ignore
      }
    }

    // Update student's enrolled courses and purchase history
    try {
      const student = await Student.findById(order.userId);
      if (student) {
        // Add courses to enrolledCourses if not already present
        for (const item of order.items) {
          const isAlreadyEnrolled = student.enrolledCourses.some(
            ec => ec.course.toString() === item.courseId.toString()
          );
          
          if (!isAlreadyEnrolled) {
            student.enrolledCourses.push({
              course: item.courseId,
              enrolledAt: new Date(),
              progress: 0,
              completedVideos: [],
              totalWatchTime: 0,
              isCompleted: false
            });
          }
        }

        // Add to purchase history
        student.purchaseHistory.push({
          order: order._id,
          courses: order.items.map(item => item.courseId),
          amount: order.amount,
          currency: order.currency,
          paymentMethod: 'razorpay',
          razorpay_payment_id: razorpay_payment_id,
          purchasedAt: new Date()
        });

        // Update statistics
        student.updateStats();
        await student.save();
      }
    } catch (error) {
      console.error('Error updating student enrollment:', error);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('verifyStudentCoursePayment error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get video with access control for students
export const getVideoForStudent = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the course first
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the video directly
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if video belongs to this course (optional - for security)
    let targetVideo = null;
    let playlistIndex = -1;
    let videoIndex = -1;

    for (let i = 0; i < course.playlists.length; i++) {
      const playlist = course.playlists[i];
      for (let j = 0; j < playlist.videos.length; j++) {
        if (playlist.videos[j].toString() === videoId) {
          targetVideo = video;
          playlistIndex = i;
          videoIndex = j;
          break;
        }
      }
      if (targetVideo) break;
    }

    if (!targetVideo) {
      return res.status(404).json({ message: 'Video not found in this course' });
    }

    // Check access permissions
    let hasFullAccess = false;
    let isPreviewOnly = false;

    if (!course.isPaid) {
      // Free course - full access
      hasFullAccess = true;
    } else {
      // Paid course - check enrollment
      const isEnrolled = course.enrolledStudents.some(
        enrollment => enrollment.student.toString() === userId
      );
      
      if (isEnrolled) {
        hasFullAccess = true;
      } else {
        // Not enrolled - NO ACCESS to individual videos
        // Preview is only available on course detail page via previewVideo field
        return res.status(403).json({ 
          message: 'Access denied. Please enroll in this course to watch videos. Preview is available on the course page.',
          requiresEnrollment: true,
          courseId: course._id,
          courseTitle: course.title,
          coursePrice: course.price,
          hasPreview: !!course.previewVideo,
          previewMessage: 'Watch the course preview on the course detail page'
        });
      }
    }

    // Determine the best video URL to use
    const getVideoUrl = () => {
      if (!hasFullAccess && !isPreviewOnly) return null;
      
      console.log('Video URL selection:', {
        videoId: video._id,
        hasHlsUrl: !!video.hlsUrl,
        hlsProcessing: video.hlsProcessing,
        hasVideoUrl: !!video.videoUrl,
        hlsUrl: video.hlsUrl,
        videoUrl: video.videoUrl
      });
      
      // Prefer HLS URL if available and ready
      if (video.hlsUrl && !video.hlsProcessing) {
        console.log('Using HLS URL:', video.hlsUrl);
        return video.hlsUrl;
      }
      
      // Fallback to regular video URL
      if (video.videoUrl) {
        console.log('Using regular video URL:', video.videoUrl);
        return video.videoUrl;
      }
      
      // For development/testing - use a sample video if no URL is available
      const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      console.log('No video URL found, using sample video for testing:', sampleVideoUrl);
      return sampleVideoUrl;
    };

    const videoUrl = getVideoUrl();

    // Prepare response (video is already fetched above)
    const response = {
      success: true,
      video: {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: videoUrl,
        hlsUrl: hasFullAccess ? video.hlsUrl : null,
        isHlsReady: !video.hlsProcessing && !!video.hlsUrl,
        hlsProcessing: video.hlsProcessing,
        previewUrl: isPreviewOnly ? videoUrl : null,
        thumbnail: video.thumbnail,
        duration: video.duration,
        quality: video.quality,
        views: video.views,
        likes: video.likes
      },
      course: {
        _id: course._id,
        title: course.title,
        isPaid: course.isPaid,
        price: course.price
      },
      access: {
        hasFullAccess,
        isPreviewOnly,
        requiresEnrollment: !hasFullAccess && !isPreviewOnly
      },
      playlist: {
        index: playlistIndex,
        title: course.playlists[playlistIndex]?.title,
        totalVideos: course.playlists[playlistIndex]?.videos.length || 0
      },
      navigation: {
        videoIndex,
        hasNext: videoIndex < (course.playlists[playlistIndex]?.videos.length - 1),
        hasPrevious: videoIndex > 0
      }
    };

    res.json(response);

  } catch (error) {
    console.error('getVideoForStudent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll student in free course
export const enrollInFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.sub;
    
    console.log('Free course enrollment request:', { 
      courseId, 
      userId, 
      userRole: req.user?.role,
      headers: req.headers.authorization ? 'Present' : 'Missing'
    });
    
    if (!userId) {
      console.error('Enrollment failed: No userId found in token');
      return res.status(401).json({ message: 'Unauthorized - No user ID found' });
    }

    // Validate courseId
    if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Enrollment failed: Invalid courseId format:', courseId);
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Enrollment failed: Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Course found:', {
      courseId: course._id,
      title: course.title,
      isPaid: course.isPaid,
      price: course.price,
      isActive: course.isActive
    });

    // Check if course is free
    if (course.isPaid && course.price > 0) {
      console.error('Enrollment failed: Course is paid:', {
        courseId,
        price: course.price,
        isPaid: course.isPaid
      });
      return res.status(400).json({ 
        message: 'This is a paid course. Please use the payment system to enroll.',
        requiresPayment: true,
        price: course.price
      });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );

    if (isAlreadyEnrolled) {
      console.log('User already enrolled in course:', { userId, courseId });
      return res.status(400).json({ 
        message: 'Already enrolled in this course',
        isEnrolled: true
      });
    }

    // Enroll student in course
    const courseUpdateResult = await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        enrolledStudents: { 
          student: userId, 
          enrolledAt: new Date(), 
          progress: 0 
        }
      },
      $inc: { 
        totalEnrollments: 1, 
        enrollmentCount: 1 
      }
    }, { new: true });

    if (!courseUpdateResult) {
      console.error('Failed to update course enrollment:', courseId);
      return res.status(500).json({ message: 'Failed to enroll in course' });
    }

    console.log('Course enrollment updated successfully:', {
      courseId,
      userId,
      newEnrollmentCount: courseUpdateResult.enrollmentCount
    });

    // Update student's enrolled courses
    try {
      let student = await Student.findById(userId);
      if (!student) {
        console.error('Student profile not found for userId:', userId);
        console.error('This indicates a data consistency issue - user exists but Student record is missing');
        console.error('User should register properly as a student or contact support');
        
        return res.status(404).json({ 
          message: 'Student profile not found. Please register as a student first.',
          error: 'MISSING_STUDENT_PROFILE',
          userId: userId,
          suggestion: 'Please register with a student account or contact support'
        });
      }

      // Initialize enrolledCourses if it doesn't exist
      if (!student.enrolledCourses) {
        student.enrolledCourses = [];
      }
      
      // Check if course is already in student's enrolled courses
      const isAlreadyInStudentCourses = student.enrolledCourses.some(
        ec => ec.course.toString() === courseId
      );
      
      if (!isAlreadyInStudentCourses) {
        student.enrolledCourses.push({
          course: courseId,
          enrolledAt: new Date(),
          progress: 0,
          completedVideos: [],
          totalWatchTime: 0,
          isCompleted: false
        });
        
        // Update statistics
        student.updateStats();
        const savedStudent = await student.save();
        
        console.log('Student enrollment updated successfully:', {
          userId,
          courseId,
          totalEnrolledCourses: savedStudent.enrolledCourses.length
        });
      } else {
        console.log('Course already in student enrolled courses:', { userId, courseId });
      }
    } catch (error) {
      console.error('Error updating student enrollment for free course:', error);
      // Don't return error here as course enrollment was successful
    }

    res.json({
      success: true,
      message: 'Successfully enrolled in the course',
      courseId: course._id,
      courseTitle: course.title
    });

  } catch (error) {
    console.error('enrollInFreeCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update video progress for student
export const updateVideoProgress = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { timeWatched, lastPosition, completed } = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );

    if (!isEnrolled && course.isPaid) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Update or create watch time record
    const existingWatchIndex = video.watchTime.findIndex(
      watch => watch.student.toString() === userId
    );

    if (existingWatchIndex >= 0) {
      // Update existing record
      video.watchTime[existingWatchIndex] = {
        student: userId,
        timeWatched: timeWatched || video.watchTime[existingWatchIndex].timeWatched,
        lastPosition: lastPosition || video.watchTime[existingWatchIndex].lastPosition,
        completed: completed !== undefined ? completed : video.watchTime[existingWatchIndex].completed,
        watchedAt: new Date()
      };
    } else {
      // Create new record
      video.watchTime.push({
        student: userId,
        timeWatched: timeWatched || 0,
        lastPosition: lastPosition || 0,
        completed: completed || false,
        watchedAt: new Date()
      });
    }

    await video.save();

    // Update student's course progress
    try {
      const student = await Student.findById(userId);
      if (student) {
        const enrolledCourseIndex = student.enrolledCourses.findIndex(
          ec => ec.course.toString() === courseId
        );

        if (enrolledCourseIndex >= 0) {
          // Update last watched video and time
          student.enrolledCourses[enrolledCourseIndex].lastWatchedVideo = videoId;
          student.enrolledCourses[enrolledCourseIndex].lastWatchedAt = new Date();
          student.enrolledCourses[enrolledCourseIndex].totalWatchTime += (timeWatched || 0);

          // Add to completed videos if completed
          if (completed && !student.enrolledCourses[enrolledCourseIndex].completedVideos.includes(videoId)) {
            student.enrolledCourses[enrolledCourseIndex].completedVideos.push(videoId);
          }

          // Calculate progress percentage
          const totalVideos = course.playlists.reduce((total, playlist) => {
            return total + (playlist.videos ? playlist.videos.length : 0);
          }, 0);

          const completedVideosCount = student.enrolledCourses[enrolledCourseIndex].completedVideos.length;
          const progressPercentage = totalVideos > 0 ? Math.round((completedVideosCount / totalVideos) * 100) : 0;
          
          student.enrolledCourses[enrolledCourseIndex].progress = progressPercentage;

          // Mark course as completed if 100% progress
          if (progressPercentage >= 100 && !student.enrolledCourses[enrolledCourseIndex].isCompleted) {
            student.enrolledCourses[enrolledCourseIndex].isCompleted = true;
            student.enrolledCourses[enrolledCourseIndex].completedAt = new Date();
          }

          // Update student statistics
          student.updateStats();
          await student.save();
        }
      }
    } catch (error) {
      console.error('Error updating student progress:', error);
    }

    // Update course progress if video is completed
    if (completed) {
      const enrollmentIndex = course.enrolledStudents.findIndex(
        enrollment => enrollment.student.toString() === userId
      );

      if (enrollmentIndex >= 0) {
        // Calculate total videos in course
        const totalVideos = course.playlists.reduce((total, playlist) => {
          return total + (playlist.videos ? playlist.videos.length : 0);
        }, 0);

        // Count completed videos for this student
        const completedVideos = await Video.countDocuments({
          'watchTime.student': userId,
          'watchTime.completed': true,
          course: courseId
        });

        // Update progress percentage
        const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        
        course.enrolledStudents[enrollmentIndex].progress = progressPercentage;
        await course.save();
      }
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: {
        timeWatched,
        lastPosition,
        completed
      }
    });

  } catch (error) {
    console.error('updateVideoProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's enrolled courses with progress
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get student with enrolled courses
    const student = await Student.findById(userId)
      .populate({
        path: 'enrolledCourses.course',
        populate: {
          path: 'creator',
          select: 'name email profilePicture'
        }
      });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Format enrolled courses with detailed progress
    const enrolledCourses = student.enrolledCourses.map(enrollment => {
      const course = enrollment.course;
      
      // Calculate total videos in course
      const totalVideos = course.playlists.reduce((total, playlist) => {
        return total + (playlist.videos ? playlist.videos.length : 0);
      }, 0);

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        subject: course.subject,
        grade: course.grade,
        level: course.level,
        creator: course.creator,
        isPaid: course.isPaid,
        price: course.price,
        
        // Detailed progress from Student model
        enrolledAt: enrollment.enrolledAt,
        progress: {
          percentage: enrollment.progress || 0,
          completedVideos: enrollment.completedVideos.length,
          totalVideos: totalVideos,
          totalWatchTime: enrollment.totalWatchTime || 0,
          isCompleted: enrollment.isCompleted || false,
          completedAt: enrollment.completedAt,
          lastWatchedVideo: enrollment.lastWatchedVideo,
          lastWatchedAt: enrollment.lastWatchedAt
        },
        
        // Course structure
        totalPlaylists: course.playlists.length,
        totalVideos: totalVideos
      };
    });

    // Sort by last watched or enrollment date
    enrolledCourses.sort((a, b) => {
      const aDate = a.progress.lastWatchedAt || a.enrolledAt;
      const bDate = b.progress.lastWatchedAt || b.enrolledAt;
      return new Date(bDate) - new Date(aDate);
    });

    res.json({
      success: true,
      courses: enrolledCourses,
      stats: {
        totalEnrolled: student.stats.totalCoursesEnrolled,
        totalCompleted: student.stats.totalCoursesCompleted,
        totalWatchTime: student.stats.totalWatchTime,
        averageProgress: student.stats.averageProgress
      }
    });

  } catch (error) {
    console.error('getEnrolledCourses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student learning analytics
export const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findById(userId)
      .populate('enrolledCourses.course', 'title subject grade isPaid price')
      .populate('purchaseHistory.courses', 'title price');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate detailed analytics
    const analytics = {
      overview: {
        totalCoursesEnrolled: student.stats.totalCoursesEnrolled,
        totalCoursesCompleted: student.stats.totalCoursesCompleted,
        totalWatchTime: student.stats.totalWatchTime,
        averageProgress: student.stats.averageProgress,
        completionRate: student.stats.totalCoursesEnrolled > 0 ? 
          Math.round((student.stats.totalCoursesCompleted / student.stats.totalCoursesEnrolled) * 100) : 0
      },
      
      courseBreakdown: {
        bySubject: {},
        byGrade: {},
        byType: { free: 0, paid: 0 }
      },
      
      recentActivity: student.enrolledCourses
        .filter(enrollment => enrollment.lastWatchedAt)
        .sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt))
        .slice(0, 5)
        .map(enrollment => ({
          courseId: enrollment.course._id,
          courseTitle: enrollment.course.title,
          lastWatchedAt: enrollment.lastWatchedAt,
          progress: enrollment.progress
        })),
      
      purchaseHistory: student.purchaseHistory.map(purchase => ({
        orderId: purchase.order,
        courses: purchase.courses.map(course => ({
          id: course._id,
          title: course.title,
          price: course.price
        })),
        amount: purchase.amount,
        currency: purchase.currency,
        purchasedAt: purchase.purchasedAt
      }))
    };

    // Calculate subject and grade breakdown
    student.enrolledCourses.forEach(enrollment => {
      const course = enrollment.course;
      
      // By subject
      if (!analytics.courseBreakdown.bySubject[course.subject]) {
        analytics.courseBreakdown.bySubject[course.subject] = 0;
      }
      analytics.courseBreakdown.bySubject[course.subject]++;
      
      // By grade
      if (!analytics.courseBreakdown.byGrade[course.grade]) {
        analytics.courseBreakdown.byGrade[course.grade] = 0;
      }
      analytics.courseBreakdown.byGrade[course.grade]++;
      
      // By type
      if (course.isPaid) {
        analytics.courseBreakdown.byType.paid++;
      } else {
        analytics.courseBreakdown.byType.free++;
      }
    });

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('getStudentAnalytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course enrollment status for a student
export const getCourseEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check enrollment in Course model
    const isEnrolledInCourse = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );

    // Check enrollment in Student model
    const student = await Student.findById(userId);
    let enrollmentDetails = null;
    
    if (student) {
      const studentEnrollment = student.enrolledCourses.find(
        ec => ec.course.toString() === courseId
      );
      
      if (studentEnrollment) {
        enrollmentDetails = {
          enrolledAt: studentEnrollment.enrolledAt,
          progress: studentEnrollment.progress,
          completedVideos: studentEnrollment.completedVideos.length,
          totalWatchTime: studentEnrollment.totalWatchTime,
          isCompleted: studentEnrollment.isCompleted,
          lastWatchedAt: studentEnrollment.lastWatchedAt
        };
      }
    }

    // User is considered enrolled if they exist in either the Course model OR Student model
    // This handles cases where there might be data inconsistency
    const isEnrolled = isEnrolledInCourse || !!enrollmentDetails;

    console.log('Enrollment status check:', {
      userId,
      courseId,
      isEnrolledInCourse,
      hasEnrollmentDetails: !!enrollmentDetails,
      hasStudent: !!student,
      finalIsEnrolled: isEnrolled
    });

    res.json({
      success: true,
      isEnrolled,
      enrollmentDetails: enrollmentDetails || (isEnrolledInCourse ? {
        enrolledAt: new Date().toISOString(), // Fallback date
        progress: 0,
        completedVideos: 0,
        totalWatchTime: 0,
        isCompleted: false,
        lastWatchedAt: null
      } : null),
      courseInfo: {
        _id: course._id,
        title: course.title,
        isPaid: course.isPaid,
        price: course.price
      }
    });

  } catch (error) {
    console.error('getCourseEnrollmentStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll in a paid course (after payment verification)
export const enrollInPaidCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { paymentId, orderId } = req.body;
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // For paid courses, verify payment (simplified for now)
    if (course.isPaid && !paymentId) {
      return res.status(400).json({ message: 'Payment verification required for paid courses' });
    }

    // Add student to course enrollment
    course.enrolledStudents.push({
      student: userId,
      enrolledAt: new Date(),
      paymentId: paymentId || null,
      orderId: orderId || null
    });

    await course.save();

    // Update student's enrolled courses
    const student = await Student.findById(userId);
    if (student) {
      if (!student.enrolledCourses) {
        student.enrolledCourses = [];
      }
      
      student.enrolledCourses.push({
        course: courseId,
        enrolledAt: new Date(),
        progress: 0,
        completedVideos: []
      });
      
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      courseId: courseId,
      enrolledAt: new Date()
    });

  } catch (error) {
    console.error('enrollInPaidCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get detailed enrolled courses with progress
export const getMyEnrolledCoursesDetailed = async (req, res) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find courses where student is enrolled
    const enrolledCourses = await Course.find({
      'enrolledStudents.student': userId
    }).populate('creator', 'name email profilePicture').select(
      'title description thumbnail isPaid price subject grade level playlists enrolledStudents createdAt'
    );

    // Get student's progress data
    const student = await Student.findById(userId).select('enrolledCourses');

    const coursesWithProgress = enrolledCourses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.student.toString() === userId
      );

      const studentProgress = student?.enrolledCourses?.find(
        ec => ec.course.toString() === course._id.toString()
      );

      // Calculate total videos in course
      let totalVideos = 0;
      course.playlists.forEach(playlist => {
        totalVideos += playlist.videos.length;
      });

      const completedVideos = studentProgress?.completedVideos?.length || 0;
      const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      console.log('Course thumbnail data:', {
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        thumbnailType: typeof course.thumbnail
      });

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        isPaid: course.isPaid,
        price: course.price,
        subject: course.subject,
        grade: course.grade,
        level: course.level,
        creator: course.creator,
        enrolledAt: enrollment?.enrolledAt,
        paymentId: enrollment?.paymentId,
        progress: {
          percentage: progressPercentage,
          completedVideos: completedVideos,
          totalVideos: totalVideos,
          lastAccessed: studentProgress?.lastAccessed
        }
      };
    });

    res.status(200).json({
      success: true,
      courses: coursesWithProgress,
      totalEnrolled: coursesWithProgress.length
    });

  } catch (error) {
    console.error('getMyEnrolledCoursesDetailed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Debug endpoint to check user and course info
export const debugEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.sub;
    const userRole = req.user?.role;
    
    console.log('Debug enrollment check:', {
      courseId,
      userId,
      userRole,
      userObject: req.user
    });

    // Check if course exists
    const course = await Course.findById(courseId);
    
    // Check if student exists
    const student = await Student.findById(userId);
    
    // Additional checks for other user types
    const creator = userRole === 'creator' ? await Creator.findById(userId) : null;
    const business = userRole === 'business' ? await Business.findById(userId) : null;
    const admin = userRole === 'admin' ? await Admin.findById(userId) : null;

    let enrollmentInfo = {};
    if (course && student) {
      const isEnrolledInCourse = course.enrolledStudents.some(
        enrollment => enrollment.student.toString() === userId
      );

      const isEnrolledInStudent = student.enrolledCourses.some(
        ec => ec.course.toString() === courseId
      );

      enrollmentInfo = {
        isEnrolledInCourse,
        isEnrolledInStudent,
        enrollmentMatch: isEnrolledInCourse === isEnrolledInStudent,
        courseEnrollmentCount: course.enrolledStudents.length,
        studentEnrollmentCount: student.enrolledCourses.length
      };
    }

    res.json({
      success: true,
      debug: {
        // User info
        userId,
        userRole,
        tokenValid: !!userId,
        
        // Profile existence
        studentProfileExists: !!student,
        creatorProfileExists: !!creator,
        businessProfileExists: !!business,
        adminProfileExists: !!admin,
        
        // Course info
        courseExists: !!course,
        courseTitle: course?.title,
        courseIsPaid: course?.isPaid,
        coursePrice: course?.price,
        
        // Enrollment info
        ...enrollmentInfo,
        
        // Recommendations
        canEnroll: !!course && !!student && userRole === 'student',
        issue: !student && userRole === 'student' ? 'MISSING_STUDENT_PROFILE' : 
               !course ? 'COURSE_NOT_FOUND' : 
               userRole !== 'student' ? 'WRONG_USER_ROLE' : null
      }
    });

  } catch (error) {
    console.error('Debug enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
};
