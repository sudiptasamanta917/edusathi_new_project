import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    items: [
      {
        contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
      },
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
