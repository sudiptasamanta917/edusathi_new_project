import mongoose from 'mongoose';

const { Schema } = mongoose;

const BusinessPurchaseSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', index: true, default: null },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', index: true, default: null },
    email: { type: String, index: true, lowercase: true },
    instituteName: { type: String },
    ownerName: { type: String },
    domain: { type: String, index: true },
    plan: { type: String },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    durationDays: { type: Number, default: null },
    billing: { type: Schema.Types.Mixed, default: null },
    razorpay_order_id: { type: String, required: true, unique: true, index: true },
    razorpay_payment_id: { type: String, default: null },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created', index: true },
  },
  { timestamps: true }
);

export default mongoose.models.BusinessPurchase || mongoose.model('BusinessPurchase', BusinessPurchaseSchema);
