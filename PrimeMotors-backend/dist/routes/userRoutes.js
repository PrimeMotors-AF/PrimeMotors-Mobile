"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadAvatar_1 = require("../middlewares/uploadAvatar");
const router = (0, express_1.Router)();
router.get('/:id', userController_1.getUserController);
router.patch('/:id', authMiddleware_1.authMiddleware, userController_1.updateUserController);
router.delete('/:id', authMiddleware_1.authMiddleware, userController_1.deleteUserController);
router.patch('/:id/avatar', 
//authMiddleware,
(req, res, next) => {
    const upload = uploadAvatar_1.uploadAvatar.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'file', maxCount: 1 },
    ]);
    upload(req, res, (err) => {
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
}, userController_1.updateAvatar);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map