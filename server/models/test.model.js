import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
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

    // Test Configuration
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

    // Questions
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        questionType: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'short-answer', 'numerical'],
            required: true
        },
        options: [String], // For MCQ
        correctAnswer: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            default: 1
        },
        explanation: String,
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        }
    }],

    // Test Settings
    timeLimit: {
        type: Number, // in minutes
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },

    // Access Control
    isPublished: {
        type: Boolean,
        default: false
    },
    startDate: Date,
    endDate: Date,
    maxAttempts: {
        type: Number,
        default: 3
    },

    // Instructions
    instructions: String,

    // Analytics
    totalAttempts: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Test = mongoose.model('Test', testSchema);
export default Test;
