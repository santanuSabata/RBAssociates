import { Router } from 'express';
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getGallery);
router.post('/', authMiddleware as any, addGalleryItem as any);
router.put('/:id', authMiddleware as any, updateGalleryItem as any);
router.delete('/:id', authMiddleware as any, deleteGalleryItem as any);

export default router;
