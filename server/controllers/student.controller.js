import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Content from '../models/Content.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/course.model.js';
import CourseOrder from '../models/CourseOrder.js';

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

    res.json({ success: true });
  } catch (err) {
    console.error('verifyStudentCoursePayment error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
