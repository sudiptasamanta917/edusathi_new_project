import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    firstName: {
        type: String,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    // phoneNumber: {
    //     type: String,
    //     required: true
    // },

    // Profile Information
    profilePicture: {
        type: String,
        default: null
    },
    avatarUrl: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxLength: 1000
    },
    specialization: [{
        type: String,
        enum: ['Mathematics', 'Science', 'English', 'History', 'Programming', 'Arts', 'Other']
    }],
    qualifications: [String],
    experience: {
        type: Number, // Years
        default: 0
    },

    // Content Statistics
    totalVideos: {
        type: Number,
        default: 0
    },
    totalCourses: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    totalFollowers: {
        type: Number,
        default: 0
    },

    // Revenue Information
    bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    totalEarnings: {
        type: Number,
        default: 0
    },

    // Platform Statistics
    averageRating: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },

    // References
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    }]
}, {
    timestamps: true
});

// Pre-save middleware to populate name field from firstName and lastName
creatorSchema.pre('save', function(next) {
    if (this.firstName && this.lastName && !this.name) {
        this.name = `${this.firstName} ${this.lastName}`;
    } else if (this.name && !this.firstName && !this.lastName) {
        const nameParts = this.name.trim().split(' ');
        this.firstName = nameParts[0] || '';
        this.lastName = nameParts.slice(1).join(' ') || '';
    }
    next();
});


const Creator = mongoose.model('Creator', creatorSchema);
export default Creator;