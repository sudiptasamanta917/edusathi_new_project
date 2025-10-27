import Student from '../models/Student.js';
import Creator from "../models/creator.model.js";
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

// List users by role for admin
export const getUsersByRole = async (req, res) => {
  try {
    const role = String(req.query.role || '').toLowerCase();
    const limitParam = Number(req.query.limit || 100);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : 100;
    const pageParam = Number(req.query.page || 1);
    const page = Number.isFinite(pageParam) ? Math.max(pageParam, 1) : 1;

    let Model;
    if (role === 'student' || role === 'students') Model = Student;
    else if (role === 'creator' || role === 'creators') Model = Creator;
    else if (role === 'business' || role === 'businesses') Model = Business;
    else if (role === 'admin' || role === 'admins') Model = AdminModel;
    else return res.status(400).json({ error: 'Invalid role' });

    const users = await Model.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name email avatarUrl isActive createdAt')
      .lean();

    res.json({ users });
  } catch (err) {
    console.error('getUsersByRole error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
