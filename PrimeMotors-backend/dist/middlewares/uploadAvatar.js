"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.uploadAvatar = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
        const mimeType = (file.mimetype || "").toLowerCase();
        if (!ALLOWED_MIMES.includes(mimeType)) {
            return cb(new Error("Tipo de arquivo não permitido. Envie apenas PNG ou JPG/JPEG."));
        }
        cb(null, true);
    },
});
//# sourceMappingURL=uploadAvatar.js.map