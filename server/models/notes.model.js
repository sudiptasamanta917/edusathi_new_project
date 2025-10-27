import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    content: {
        type: String,
        required: true
    },

    // File Information
    fileUrl: {
        type: String
    },
    fileType: {
        type: String,
        enum: ['PDF', 'DOC', 'PPT', 'TEXT'],
        default: 'PDF'
    },
    fileSize: Number, // in bytes

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
    subject: String,
    tags: [String],

    // Access
    isPublic: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Notes = mongoose.model('Notes', notesSchema);
export default Notes;
