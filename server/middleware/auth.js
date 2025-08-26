import { verifyAccessToken } from '../utils/jwt.js';

export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = verifyAccessToken(token);
    req.user = { ...payload, _id: payload.sub };
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const payload = verifyAccessToken(token); // { sub, role }
    req.user = { _id: payload.sub, sub: payload.sub, role: payload.role };
    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    const user = req.user || {};
    if (!user || !user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Default export for backward compatibility
export default authenticateToken;
