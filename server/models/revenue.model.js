import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },

    // Revenue Sources
    source: {
        type: String,
        enum: ['video_views', 'course_enrollment', 'premium_subscription', 'tips'],
        required: true
    },

    // Amount Details
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },

    // Transaction Details
    transactionId: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },

    // Related Content
    relatedContent: {
        contentType: {
            type: String,
            enum: ['video', 'course', 'test']
        },
        contentId: mongoose.Schema.Types.ObjectId,
        contentTitle: String
    },

    // Payment Details
    paymentDate: Date,
    paymentMethod: String,

    // Calculations
    platformFee: {
        type: Number,
        default: 0
    },
    creatorEarning: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Revenue = mongoose.model('Revenue', revenueSchema);
export default Revenue;