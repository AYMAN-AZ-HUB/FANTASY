import express from 'express';
import { createAdmin , loginAdmin } from '../controllers/admincontrollers.js';

const router = express.Router();

router.post('/admin', createAdmin);
router.post('/logadmin', loginAdmin);

export default router;