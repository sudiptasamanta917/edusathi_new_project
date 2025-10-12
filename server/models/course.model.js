import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    shortDescription: {
        type: String,
        maxLength: 500
    },

    // Course Details
    subject: {
        type: String,
        required: true,
        enum: ['Mathematics', 'Science', 'English', 'History', 'Programming', 'Arts', 'Other']
    },
    grade: {
        type: String,
        required: true,
        enum: ['6th', '7th', '8th', '9th', '10th', '11th', '12th', 'Undergraduate', 'Graduate']
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },

    // Media
    thumbnail: {
        type: String,
        required: true
    },
    previewVideo: {
        type: String
    },

    // Creator Information
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },

    // Content Organization
    playlists: [{
        title: String,
        description: String,
        videos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }],
        order: Number
    }],

    // Resources
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    }],
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
    practiceQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeQuestion'
    }],

    // Pricing & Access
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },

    // Enrollment
    enrolledStudents: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        enrolledAt: Date,
        progress: Number
    }],
    maxStudents: Number,

    // Analytics
    totalViews: {
        type: Number,
        default: 0
    },
    totalEnrollments: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },

    // Status
    isPublished: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Reviews
    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
