import { Router } from 'express';
import { getJourney, addJourneyMilestone, updateJourneyMilestone, deleteJourneyMilestone } from '../controllers/journeyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getJourney);
router.post('/', authMiddleware as any, addJourneyMilestone as any);
router.put('/:id', authMiddleware as any, updateJourneyMilestone as any);
router.delete('/:id', authMiddleware as any, deleteJourneyMilestone as any);

export default router;
