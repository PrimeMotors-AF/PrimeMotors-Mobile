import { Router } from 'express';
import { deleteUserController, getUserController, updateUserController, updateAvatar } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadAvatar } from '../middlewares/uploadAvatar';

const router = Router();

router.get('/:id', getUserController);
router.patch('/:id', authMiddleware, updateUserController);
router.delete('/:id', authMiddleware, deleteUserController);
router.patch(
  '/:id/avatar',
  authMiddleware,
  uploadAvatar.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  updateAvatar,
);

export default router;