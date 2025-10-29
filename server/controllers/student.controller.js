import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Content from '../models/Content.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/course.model.js';
import CourseOrder from '../models/CourseOrder.js';
import CourseEnrollment from '../models/CourseEnrollment.js';

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

    // Calculate total amount in rupees
    const amountRupees = foundCourses.reduce((sum, c) => {
      const price = Number(c.price) || 0;
      console.log(`Course ${c._id} price: ${price} rupees`);
      return sum + price;
    }, 0);

    // Convert to paise (1 rupee = 100 paise)
    const amountPaise = Math.max(1, Math.round(amountRupees * 100));
    console.log(`Total amount: ${amountRupees} rupees = ${amountPaise} paise`);

    const receipt = `crs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const rpOrder = await razorpay.orders.create({ 
      amount: amountPaise, 
      currency: 'INR', 
      receipt 
    });

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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing required payment verification fields:', {
        hasOrderId: !!razorpay_order_id,
        hasPaymentId: !!razorpay_payment_id,
        hasSignature: !!razorpay_signature
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment verification fields',
        details: 'Please provide razorpay_order_id, razorpay_payment_id, and razorpay_signature'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    console.log('Verifying payment:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      receivedSignature: razorpay_signature,
      expectedSignature: expectedSignature,
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      await CourseOrder.findOneAndUpdate(
        { razorpay_order_id },
        { status: 'failed' },
        { new: true }
      );
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed',
        details: 'Signature verification failed. Please ensure you are sending the correct signature.'
      });
    }

    const order = await CourseOrder.findOneAndUpdate(
      { razorpay_order_id },
      { status: 'paid', razorpay_payment_id },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    // Enroll user into each course using CourseEnrollment model
    const enrolledCourses = [];
    for (const it of order.items) {
      try {
        // Create enrollment in CourseEnrollment collection
        const enrollment = await CourseEnrollment.create({
          userId: order.userId,
          courseId: it.courseId,
          orderId: order._id,
          progress: 0,
          enrolledAt: new Date()
        });
        enrolledCourses.push(enrollment);

        // Also update Course model for analytics
        await Course.findByIdAndUpdate(
          it.courseId,
          {
            $addToSet: {
              enrolledStudents: { student: order.userId, enrolledAt: new Date(), progress: 0 },
            },
            $inc: { totalEnrollments: 1, enrollmentCount: 1 },
          }
        );
      } catch (e) {
        console.error('Enrollment error for course', it.courseId, e);
        // Continue with other courses even if one fails
      }
    }

    res.json({ 
      success: true, 
      message: 'Payment verified and enrolled successfully',
      enrolledCount: enrolledCourses.length 
    });
  } catch (err) {
    console.error('verifyStudentCoursePayment error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all enrolled courses for student
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const enrollments = await CourseEnrollment.find({ 
      userId, 
      isActive: true 
    })
      .populate({
        path: 'courseId',
        select: 'title description thumbnail price duration level subject grade creator playlists isPublished',
        populate: {
          path: 'creator',
          select: 'name email profilePicture'
        }
      })
      .sort({ enrolledAt: -1 });

    const courses = enrollments
      .filter(en => en.courseId) // Filter out any null courses
      .map(en => {
        const course = en.courseId;
        return {
          enrollmentId: en._id,
          courseId: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          price: course.price,
          duration: course.duration,
          level: course.level,
          subject: course.subject,
          grade: course.grade,
          progress: en.progress || 0,
          enrolledAt: en.enrolledAt,
          lastAccessedAt: en.lastAccessedAt,
          creator: course.creator ? {
            id: course.creator._id,
            name: course.creator.name,
            email: course.creator.email,
            profilePicture: course.creator.profilePicture
          } : null,
          playlists: course.playlists || [],
          isPublished: course.isPublished
        };
      });

    res.json({ 
      success: true,
      courses,
      total: courses.length 
    });
  } catch (err) {
    console.error('getMyEnrolledCourses error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if student has access to a specific course
export const checkCourseAccess = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { courseId } = req.params;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!courseId) return res.status(400).json({ message: 'Course ID required' });

    const enrollment = await CourseEnrollment.findOne({ 
      userId, 
      courseId,
      isActive: true 
    });

    if (!enrollment) {
      return res.json({ 
        hasAccess: false,
        message: 'You need to purchase this course to access it'
      });
    }

    // Update last accessed time
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.json({ 
      hasAccess: true,
      enrollment: {
        id: enrollment._id,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        completedVideos: enrollment.completedVideos || []
      }
    });
  } catch (err) {
    console.error('checkCourseAccess error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll in free course (no payment required)
export const enrollFreeCourse = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { courseId } = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!courseId) return res.status(400).json({ message: 'Course ID required' });

    // Check if course exists and is free
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course is actually free
    if (course.price > 0) {
      return res.status(400).json({ message: 'This course requires payment' });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({ 
      userId, 
      courseId,
      isActive: true 
    });

    if (existingEnrollment) {
      return res.status(400).json({ 
        message: 'You are already enrolled in this course',
        enrollmentId: existingEnrollment._id
      });
    }

    // Create enrollment
    const enrollment = await CourseEnrollment.create({
      userId,
      courseId,
      progress: 0,
      enrolledAt: new Date(),
      isActive: true
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          enrolledStudents: { student: userId, enrolledAt: new Date(), progress: 0 },
        },
        $inc: { totalEnrollments: 1, enrollmentCount: 1 },
      }
    );

    res.json({ 
      success: true,
      message: 'Successfully enrolled in free course',
      enrollment: {
        id: enrollment._id,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt
      }
    });

  } catch (err) {
    console.error('enrollFreeCourse error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update course progress - mark video as complete
export const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { courseId, videoId } = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!courseId || !videoId) {
      return res.status(400).json({ message: 'Course ID and Video ID required' });
    }

    // Find enrollment
    const enrollment = await CourseEnrollment.findOne({ 
      userId, 
      courseId,
      isActive: true 
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add video to completed list if not already there
    if (!enrollment.completedVideos.includes(videoId)) {
      enrollment.completedVideos.push(videoId);
    }

    // Get course to calculate progress
    const course = await Course.findById(courseId).select('playlists');
    if (course) {
      // Count total videos in all playlists
      let totalVideos = 0;
      course.playlists.forEach(playlist => {
        totalVideos += (playlist.videos || []).length;
      });

      // Calculate progress percentage
      if (totalVideos > 0) {
        enrollment.progress = Math.round((enrollment.completedVideos.length / totalVideos) * 100);
      }
    }

    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.json({ 
      success: true,
      message: 'Progress updated successfully',
      progress: enrollment.progress,
      completedVideos: enrollment.completedVideos.length,
      totalVideos: course ? course.playlists.reduce((sum, p) => sum + (p.videos || []).length, 0) : 0
    });

  } catch (err) {
    console.error('updateCourseProgress error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
