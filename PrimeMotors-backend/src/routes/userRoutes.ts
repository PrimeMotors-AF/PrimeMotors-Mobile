import { Router } from 'express';
import { deleteUserController, getUserController, updateUserController, updateAvatar } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadAvatar } from '../middlewares/uploadAvatar';
import { ApiError } from '../errors/ApiError';

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

    upload(req, res, (error: unknown) => {
      if (error) {
        const code =
          typeof error === 'object' &&
          error !== null &&
          'code' in error
            ? error.code
            : undefined;
        const message =
          error instanceof Error ? error.message : 'Erro no envio do arquivo.';
        if (code === 'LIMIT_FILE_SIZE') {
          next(new ApiError(
            400,
            'UPLOAD_TOO_LARGE',
            'O arquivo é muito grande. O tamanho máximo permitido é 5MB.',
          ));
          return;
        }

        next(new ApiError(
          400,
          'INVALID_UPLOAD',
          message,
        ));
        return;
      }

      next();
    });
  },
  updateAvatar
);

export default router;