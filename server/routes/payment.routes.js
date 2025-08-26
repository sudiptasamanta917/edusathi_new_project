import express from 'express';
import { createPaymentOrder, verifyPayment, getPaymentConfig, getMyBusinessPurchases } from '../controllers/payment.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/config', getPaymentConfig);
router.get('/purchases/my', authenticateToken, requireRole(['business']), getMyBusinessPurchases);

export default router;
