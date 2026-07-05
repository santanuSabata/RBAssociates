import { Router } from 'express';
import { getServices, addService, updateService, deleteService } from '../controllers/serviceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getServices);
router.post('/', authMiddleware as any, addService as any);
router.put('/:id', authMiddleware as any, updateService as any);
router.delete('/:id', authMiddleware as any, deleteService as any);

export default router;
