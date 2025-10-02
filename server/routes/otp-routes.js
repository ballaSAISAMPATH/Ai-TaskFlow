import { Router } from 'express';
const router = Router();
import { sendOTP, verifyOTP, resendOTP, changePassword } from '../controllers/otp-controller.js'; 

router.post('/send', sendOTP);

router.post('/verify', verifyOTP);

router.post('/resend', resendOTP);
router.post('/change-password',changePassword)

export default router;