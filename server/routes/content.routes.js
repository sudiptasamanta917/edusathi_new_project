import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createContent,
  getMyContents,
  getContentById,
  updateContent,
  deleteContent,
  assignToBusiness,
} from '../controllers/content.controller.js';

const router = express.Router();

// Create content (creator only)
router.post(
  '/',
  authenticateToken,
  requireRole(['creator']),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  createContent
);

// Get current creator contents
router.get('/my', authenticateToken, requireRole(['creator']), getMyContents);

// Get a content by id (creator only)
router.get('/:id', authenticateToken, requireRole(['creator']), getContentById);

// Update content (creator only)
router.put('/:id', authenticateToken, requireRole(['creator']), updateContent);

// Delete content (creator only)
router.delete('/:id', authenticateToken, requireRole(['creator']), deleteContent);

// Assign content to a business (creator only)
router.put('/:id/assign', authenticateToken, requireRole(['creator']), assignToBusiness);

export default router;
