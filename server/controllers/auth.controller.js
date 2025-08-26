import bcrypt from 'bcryptjs';
import Business from '../models/Business.js';
import Student from '../models/Student.js';
import Creator from '../models/Creator.js';
import Admin from '../models/Admin.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { getFileUrl } from '../middleware/upload.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const newRole = (role || 'student').toLowerCase();

    const Model = getRoleModel(newRole);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const exists = await Model.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered for this role' });

    const hash = await bcrypt.hash(password, 10);
    const base = { name, email: String(email).toLowerCase(), password: hash };
    let created;
    if (newRole === 'business') {
      created = await Model.create({ ...base });
    } else if (newRole === 'student') {
      created = await Model.create({ ...base });
    } else if (newRole === 'creator') {
      created = await Model.create({ ...base });
    } else if (newRole === 'admin') {
      created = await Model.create({ ...base });
    }

    const access_token = signAccessToken({ sub: created._id.toString(), role: newRole });
    const refresh_token = signRefreshToken({ sub: created._id.toString(), role: newRole });

    res.status(201).json({
      user: sanitizeRoleUser(created, newRole),
      access_token,
      refresh_token,
    });
  } catch (err) {
    if (err && (err.code === 11000 || String(err?.message || '').toLowerCase().includes('duplicate key'))) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

function getRoleModel(role) {
  if (role === 'business') return Business;
  if (role === 'student') return Student;
  if (role === 'creator') return Creator;
  if (role === 'admin') return Admin;
  return null;
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
    const selectedRole = (role || '').toLowerCase();
    const Model = getRoleModel(selectedRole);
    if (!Model) return res.status(400).json({ message: 'role is required' });

    const account = await Model.findOne({ email: String(email).toLowerCase() });
    if (!account) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, account.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const access_token = signAccessToken({ sub: account._id.toString(), role: selectedRole });
    const refresh_token = signRefreshToken({ sub: account._id.toString(), role: selectedRole });

    res.json({
      user: sanitizeRoleUser(account, selectedRole),
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body || {};
    if (!refresh_token) return res.status(400).json({ message: 'Missing refresh_token' });

    const payload = verifyRefreshToken(refresh_token);
    const access_token = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ access_token });
  } catch (_err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const role = req.user?.role;
    const Model = getRoleModel(role);
    if (!Model) return res.status(400).json({ error: 'Invalid role' });

    const account = await Model.findById(userId).select('name email avatarUrl');
    if (!account) return res.status(404).json({ error: 'User not found' });

    res.json({ user: sanitizeRoleUser(account, role) });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const role = req.user?.role;
    const Model = getRoleModel(role);
    if (!Model) return res.status(400).json({ error: 'Invalid role' });

    const account = await Model.findById(userId);
    if (!account) return res.status(404).json({ error: 'User not found' });

    account.avatarUrl = getFileUrl(file.filename);
    await account.save();

    res.json({ user: sanitizeRoleUser(account, role) });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function sanitizeRoleUser(doc, role) {
  return { id: String(doc._id), name: doc.name, email: doc.email, role: role, roles: [role], avatarUrl: doc.avatarUrl || '' };
}
