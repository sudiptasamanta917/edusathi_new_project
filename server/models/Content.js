import mongoose from 'mongoose';

const { Schema } = mongoose;

const ContentSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'live'], required: true },
  price: { type: Number, required: true, min: 0 },
  fileUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  resourceUrl: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },
  businessName: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
