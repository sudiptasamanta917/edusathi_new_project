import mongoose from 'mongoose';

const { Schema } = mongoose;

const CourseEnrollmentSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true,
      index: true 
    },
    courseId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true,
      index: true 
    },
    orderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'CourseOrder' 
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedVideos: [{
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }],
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Unique constraint: one user can enroll in a course only once
CourseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for querying user's enrollments
CourseEnrollmentSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.CourseEnrollment || mongoose.model('CourseEnrollment', CourseEnrollmentSchema);
