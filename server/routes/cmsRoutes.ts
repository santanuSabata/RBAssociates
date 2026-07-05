import { Router } from 'express';
import { 
  getCMSContent, 
  updateCMSContent,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/cmsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getCMSContent);
router.put('/', authMiddleware as any, updateCMSContent as any);

// FAQ sub-routes under CMS
router.get('/faqs', getFAQs);
router.post('/faqs', authMiddleware as any, createFAQ as any);
router.put('/faqs/:id', authMiddleware as any, updateFAQ as any);
router.delete('/faqs/:id', authMiddleware as any, deleteFAQ as any);

export default router;
