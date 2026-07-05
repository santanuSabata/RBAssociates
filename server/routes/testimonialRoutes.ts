import { Router } from 'express';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', authMiddleware as any, addTestimonial as any);
router.put('/:id', authMiddleware as any, updateTestimonial as any);
router.delete('/:id', authMiddleware as any, deleteTestimonial as any);

export default router;
