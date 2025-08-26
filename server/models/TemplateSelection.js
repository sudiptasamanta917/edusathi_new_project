import mongoose from 'mongoose';

const { Schema } = mongoose;

const TemplateSelectionSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    templateId: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TemplateSelection = mongoose.models.TemplateSelection || mongoose.model('TemplateSelection', TemplateSelectionSchema);
export default TemplateSelection;
