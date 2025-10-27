import mongoose from 'mongoose';

const { Schema } = mongoose;

const RevenueSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: true, index: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Revenue || mongoose.model('Revenue', RevenueSchema);
