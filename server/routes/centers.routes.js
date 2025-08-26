import express from 'express';
import { getCenters, createCenter, getCenterById, deleteCenter, findCenter, setCenterTemplate } from '../controllers/centers.controller.js';

const router = express.Router();

// GET /api/centers
router.get('/', getCenters);
// GET /api/centers/lookup?email=...&domain=...
router.get('/lookup', findCenter);
// POST /api/centers
router.post('/', createCenter);
// POST /api/centers/template
router.post('/template', setCenterTemplate);
// GET /api/centers/:id
router.get('/:id', getCenterById);
// DELETE /api/centers/:id
router.delete('/:id', deleteCenter);

export default router;
