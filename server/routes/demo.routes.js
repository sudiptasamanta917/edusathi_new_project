import express from 'express';
import { handleDemo } from '../controllers/demo.controller.js';

const router = express.Router();

router.get('/', handleDemo);

export default router;
