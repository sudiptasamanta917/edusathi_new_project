import express from 'express';
import { applyTemplate } from '../controllers/templates.controller.js';
import authenticateToken, { requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/templates/apply
router.post('/apply', authenticateToken, requireRole(['business']), applyTemplate);

export default router;
