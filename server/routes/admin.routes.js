import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getRoleStats, getRecentPurchases, getRecentTemplateSelections } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/role-stats', authenticateToken, requireRole(['admin']), getRoleStats);
router.get('/recent-purchases', authenticateToken, requireRole(['admin']), getRecentPurchases);
router.get('/recent-template-selections', authenticateToken, requireRole(['admin']), getRecentTemplateSelections);

export default router;
