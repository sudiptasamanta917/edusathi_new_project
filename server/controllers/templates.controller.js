import TemplateSelection from '../models/TemplateSelection.js';
import Center from '../models/Center.js';
import Business from '../models/Business.js';

// POST /api/templates/apply
// Requires authenticateToken middleware to set req.user
export const applyTemplate = async (req, res) => {
  try {
    const businessId = req.user?._id || req.user?.sub;
    const { templateId } = req.body || {};
    if (!businessId) return res.status(401).json({ error: 'Unauthorized' });
    if (!templateId) return res.status(400).json({ error: 'templateId is required' });

    // Lookup business to get email
    const business = await Business.findById(businessId).select('email');
    if (!business?.email) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Update the Center document for this user's email
    const updatedCenter = await Center.findOneAndUpdate(
      { email: business.email },
      { $set: { templateId } },
      { new: true }
    );

    // Persist selection history (non-blocking with await for consistency)
    const doc = new TemplateSelection({ businessId, templateId, appliedAt: new Date() });
    await doc.save();

    return res.json({
      ok: true,
      templateId,
      center: updatedCenter
        ? { id: updatedCenter._id.toString(), email: updatedCenter.email, templateId: updatedCenter.templateId }
        : null,
      selection: { id: doc._id.toString(), businessId: doc.businessId.toString(), templateId: doc.templateId, appliedAt: doc.appliedAt },
    });
  } catch (error) {
    console.error('applyTemplate error:', error);
    return res.status(500).json({ error: 'Failed to save template selection' });
  }
};

export default { applyTemplate };
