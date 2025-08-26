import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getRoleStats } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/role-stats', authenticateToken, requireRole(['admin']), getRoleStats);

export default router;
