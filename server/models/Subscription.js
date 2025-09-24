import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: 'PricingPlan', required: true, index: true },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, index: true },
    status: { type: String, enum: ['active', 'pending', 'failed'], default: 'active', index: true },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, planId: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
