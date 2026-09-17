import { Router } from 'express';
import multer from 'multer';
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
  (req, res, next) => {
    const upload = uploadAvatar.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'file', maxCount: 1 },
    ]);

    upload(req, res, (err: any) => {
      if (err) {
        // Intercepta o tamanho do arquivo
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            message: 'O arquivo é muito grande. O tamanho máximo permitido é 5MB.',
          });
          return;
        }

        // Intercepta tipo não permitido ou outros erros do Multer
        res.status(400).json({ message: err.message || 'Erro no envio do arquivo.' });
        return;
      }

      next();
    });
  },
  updateAvatar
);

export default router;