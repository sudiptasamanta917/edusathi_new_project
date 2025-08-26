import mongoose from 'mongoose';

const { Schema } = mongoose;

const EnrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
