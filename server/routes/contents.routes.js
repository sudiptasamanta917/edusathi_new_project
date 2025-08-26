import express from 'express';
import { listContents } from '../controllers/contents.controller.js';

const router = express.Router();

router.get('/', listContents);

export default router;
