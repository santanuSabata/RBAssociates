import { Router } from 'express';
import { getTeam, addTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getTeam);
router.post('/', authMiddleware as any, addTeamMember as any);
router.put('/:id', authMiddleware as any, updateTeamMember as any);
router.delete('/:id', authMiddleware as any, deleteTeamMember as any);

export default router;
