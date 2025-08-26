import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
