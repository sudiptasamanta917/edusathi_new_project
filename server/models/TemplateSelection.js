import mongoose from 'mongoose';

const { Schema } = mongoose;

const TemplateSelectionSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    templateId: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    // Store snapshot of logged-in user's data at the time of applying template
    businessEmail: { type: String, lowercase: true, index: true },
    businessName: { type: String },
    // Related center information (if available)
    centerId: { type: Schema.Types.ObjectId, ref: 'Center' },
    domain: { type: String, lowercase: true },
  },
  { timestamps: true }
);

const TemplateSelection = mongoose.models.TemplateSelection || mongoose.model('TemplateSelection', TemplateSelectionSchema);
export default TemplateSelection;
