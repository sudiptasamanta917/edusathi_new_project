import mongoose from 'mongoose';

const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  
  // Enrolled Courses Tracking
  enrolledCourses: [{
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course',
      required: true
    },
    enrolledAt: { 
      type: Date, 
      default: Date.now 
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
    lastWatchedVideo: { 
      type: Schema.Types.ObjectId, 
      ref: 'Video' 
    },
    lastWatchedAt: { 
      type: Date 
    },
    totalWatchTime: { 
      type: Number, 
      default: 0 // in seconds
    },
    isCompleted: { 
      type: Boolean, 
      default: false 
    },
    completedAt: { 
      type: Date 
    }
  }],

  // Purchase History
  purchaseHistory: [{
    order: { 
      type: Schema.Types.ObjectId, 
      ref: 'CourseOrder',
      required: true
    },
    courses: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Course' 
    }],
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: 'INR' 
    },
    paymentMethod: { 
      type: String, 
      default: 'razorpay' 
    },
    razorpay_payment_id: String,
    purchasedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],

  // Learning Statistics
  stats: {
    totalCoursesEnrolled: { 
      type: Number, 
      default: 0 
    },
    totalCoursesCompleted: { 
      type: Number, 
      default: 0 
    },
    totalWatchTime: { 
      type: Number, 
      default: 0 // in seconds
    },
    totalVideosWatched: { 
      type: Number, 
      default: 0 
    },
    averageProgress: { 
      type: Number, 
      default: 0 
    },
    lastActiveAt: { 
      type: Date, 
      default: Date.now 
    }
  },

  // Preferences
  preferences: {
    language: { 
      type: String, 
      default: 'English' 
    },
    timezone: { 
      type: String, 
      default: 'Asia/Kolkata' 
    },
    emailNotifications: { 
      type: Boolean, 
      default: true 
    },
    pushNotifications: { 
      type: Boolean, 
      default: true 
    }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
StudentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average progress
StudentSchema.methods.calculateAverageProgress = function() {
  if (this.enrolledCourses.length === 0) return 0;
  
  const totalProgress = this.enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(totalProgress / this.enrolledCourses.length);
};

// Update learning statistics
StudentSchema.methods.updateStats = function() {
  this.stats.totalCoursesEnrolled = this.enrolledCourses.length;
  this.stats.totalCoursesCompleted = this.enrolledCourses.filter(course => course.isCompleted).length;
  this.stats.averageProgress = this.calculateAverageProgress();
  this.stats.lastActiveAt = new Date();
};

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
