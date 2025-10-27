import TemplateSelection from '../models/TemplateSelection.js';
import Center from '../models/Center.js';
import Business from '../models/Business.js';

// Escape regex special chars for safe case-insensitive exact matching
function escapeRegExp(str = '') {
  // Escape special characters: . * + ? ^ $ { } ( ) | [ ] \
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// POST /api/templates/apply
// Requires authenticateToken middleware to set req.user
export const applyTemplate = async (req, res) => {
  try {
    const businessId = req.user?._id || req.user?.sub;
    const { templateId } = req.body || {};
    if (!businessId) return res.status(401).json({ error: 'Unauthorized' });
    if (!templateId) return res.status(400).json({ error: 'templateId is required' });

    // Lookup business to get email
    const business = await Business.findById(businessId).select('email name');
    if (!business?.email) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Normalize email for consistent lookup
    const email = String(business.email).trim().toLowerCase();

    // Find current center to decide conditional updates (avoid overwriting existing data)
    const currentCenter = await Center.findOne({ email });
    const update = { templateId };
    // If the same template is already applied, short-circuit and avoid creating duplicate history
    if (currentCenter && String(currentCenter.templateId || '') === String(templateId)) {
      return res.json({
        ok: true,
        alreadyApplied: true,
        templateId,
        center: { id: currentCenter._id.toString(), email: currentCenter.email, templateId: currentCenter.templateId },
      });
    }
    if (business?.name && (!currentCenter || !currentCenter.instituteName)) {
      update.instituteName = business.name;
    }
    if (business?.name && (!currentCenter || !currentCenter.ownerName)) {
      update.ownerName = business.name;
    }

    // Update the Center document for this user's email
    let updatedCenter = await Center.findOneAndUpdate(
      { email },
      { $set: update },
      { new: true }
    );
    // Fallback: legacy records may have mixed-case email stored
    if (!updatedCenter) {
      const ci = await Center.findOne({ email: new RegExp(`^${escapeRegExp(email)}$`, 'i') });
      if (ci) {
        updatedCenter = await Center.findByIdAndUpdate(
          ci._id,
          { $set: update },
          { new: true }
        );
      }
    }

    // Persist selection history with snapshot of user and center info
    const centerDoc = updatedCenter || currentCenter || (await Center.findOne({ email }));
    const doc = new TemplateSelection({
      businessId,
      templateId,
      appliedAt: new Date(),
      businessEmail: email,
      businessName: business?.name || undefined,
      centerId: centerDoc?._id,
      domain: centerDoc?.domain,
    });
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
