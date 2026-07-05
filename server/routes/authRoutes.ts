import { Router } from 'express';
import { login, verifySession } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/session', authMiddleware as any, verifySession as any);

export default router;
