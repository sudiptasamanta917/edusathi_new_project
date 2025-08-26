import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { createBusiness, getBusinesses } from '../controllers/business.controller.js';

const router = express.Router();

router.get('/', authenticateToken, getBusinesses);
router.post('/', authenticateToken, requireRole(['business']), createBusiness);

export default router;
