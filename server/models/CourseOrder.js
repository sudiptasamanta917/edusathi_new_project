import mongoose from 'mongoose';

const { Schema } = mongoose;

const CourseOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    items: [
      {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
      },
    ],
    amount: { type: Number, required: true }, // paise
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.CourseOrder || mongoose.model('CourseOrder', CourseOrderSchema);
