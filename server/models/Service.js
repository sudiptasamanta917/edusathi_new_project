// models/Service.js
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
    domain: { type: String, required: true },
    subdomain: { type: String, default: "admin.thecomputeracademy.org" },
    instituteName: { type: String, required: true },
    port: { type: Number, required: true, unique: true },
    status: { 
        type: String, 
        enum: ['running', 'stopped', 'pending', 'failed', 'stopping', 'restarting', 'deleting'], 
        default: 'pending' 
    },
    deployedAt: { type: Date },
    stoppedAt: { type: Date },
    restartedAt: { type: Date },
    error: { type: String }
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);