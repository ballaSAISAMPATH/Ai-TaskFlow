import express from 'express';
import { getRecentLogins } from '../controllers/historylogin-controller.js';

const router = express.Router();

router.get('/recent-logins', getRecentLogins);

export default router;