import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        maxLength: 1000
    },

    // Video Details
    videoUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    quality: {
        type: String,
        enum: ['720p', '1080p', '480p'],
        default: '720p'
    },

    // Organization
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },
    playlistOrder: {
        type: Number,
        default: 0
    },

    // Engagement
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },

    // Access Control
    isPublic: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    },

    // Analytics
    watchTime: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        timeWatched: Number, // in seconds
        lastPosition: Number,
        completed: Boolean,
        watchedAt: Date
    }]
}, {
    timestamps: true
});


const Video = mongoose.model('Video', videoSchema);
export default Video;
