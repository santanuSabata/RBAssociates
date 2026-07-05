import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getUsers as any);
router.post('/', createUser as any);
router.put('/:id', updateUser as any);
router.delete('/:id', deleteUser as any);

export default router;
