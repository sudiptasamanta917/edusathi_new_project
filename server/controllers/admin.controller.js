import Student from '../models/Student.js';
import Creator from '../models/Creator.js';
import Business from '../models/Business.js';
import AdminModel from '../models/Admin.js';

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
