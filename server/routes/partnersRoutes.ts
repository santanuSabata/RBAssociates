import { Router } from 'express';
import { getPartners, addPartner, updatePartner, deletePartner } from '../controllers/partnersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPartners);
router.post('/', authMiddleware as any, addPartner as any);
router.put('/:id', authMiddleware as any, updatePartner as any);
router.delete('/:id', authMiddleware as any, deletePartner as any);

export default router;
