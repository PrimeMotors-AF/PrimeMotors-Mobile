import { Router } from 'express';
import { deleteUserController, getUserController, updateUserController, updateAvatar } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:id', getUserController);
router.patch('/:id', authMiddleware, updateUserController);
router.delete("/:id",authMiddleware,  deleteUserController);
router.patch('/:id/avatar', authMiddleware, updateAvatar);

export default router;