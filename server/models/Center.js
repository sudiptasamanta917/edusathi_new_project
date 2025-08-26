import mongoose from 'mongoose';

const { Schema } = mongoose;

const CenterSchema = new Schema({
  instituteName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  domain: { type: String, required: true, unique: true },
  plan: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  templateId: { type: String },
  createdAt: { type: Date, default: Date.now },
  subscriptionStartAt: { type: Date },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.Center || mongoose.model('Center', CenterSchema);
