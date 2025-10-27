import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getRoleStats, getRecentPurchases, getRecentTemplateSelections, getUsersByRole } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/role-stats', authenticateToken, requireRole(['admin']), getRoleStats);
router.get('/recent-purchases', authenticateToken, requireRole(['admin']), getRecentPurchases);
router.get('/recent-template-selections', authenticateToken, requireRole(['admin']), getRecentTemplateSelections);
router.get('/users', authenticateToken, requireRole(['admin']), getUsersByRole);

export default router;
