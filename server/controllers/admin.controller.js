import Student from '../models/Student.js';
import Creator from '../models/Creator.js';
import Business from '../models/Business.js';
import AdminModel from '../models/Admin.js';
import BusinessPurchase from '../models/BusinessPurchase.js';
import TemplateSelection from '../models/TemplateSelection.js';

export const getRoleStats = async (_req, res) => {
  try {
    const [
      students,
      creators,
      businesses,
      admins,
    ] = await Promise.all([
      Student.countDocuments({}),
      Creator.countDocuments({}),
      Business.countDocuments({}),
      AdminModel.countDocuments({}),
    ]);

    const totalUsers = students + creators + businesses + admins;

    res.json({
      totalUsers,
      collections: {
        students,
        creators,
        businesses,
        admins,
      },
    });
  } catch (err) {
    console.error('getRoleStats error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List recent paid purchases for admin notifications
export const getRecentPurchases = async (req, res) => {
  try {
    const limitParam = Number(req.query.limit || 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

    const purchases = await BusinessPurchase.find({ status: 'paid' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('instituteName ownerName email domain plan amount currency createdAt createdByRole createdByEmail createdByName centerId businessId razorpay_payment_id')
      .populate('centerId', 'instituteName domain plan expiresAt')
      .populate('businessId', 'name email phone address avatarUrl isActive')
      .lean();

    res.json({ purchases });
  } catch (err) {
    console.error('getRecentPurchases error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List recent template selections for admin notifications
export const getRecentTemplateSelections = async (req, res) => {
  try {
    const limitParam = Number(req.query.limit || 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

    const selections = await TemplateSelection.find({})
      .sort({ appliedAt: -1, createdAt: -1 })
      .limit(limit)
      .select('templateId appliedAt createdAt businessEmail businessName domain centerId businessId')
      .populate('centerId', 'instituteName domain templateId')
      .populate('businessId', 'name email')
      .lean();

    res.json({ selections });
  } catch (err) {
    console.error('getRecentTemplateSelections error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
