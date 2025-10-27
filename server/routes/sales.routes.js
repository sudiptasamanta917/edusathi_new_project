import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getMySales, getContentSales } from '../controllers/sales.controller.js';

const router = express.Router();

// Sales routes (Creator only)
router.get('/my', authenticateToken, requireRole(['creator']), getMySales);
router.get('/content/:contentId', authenticateToken, requireRole(['creator']), getContentSales);

export default router;
