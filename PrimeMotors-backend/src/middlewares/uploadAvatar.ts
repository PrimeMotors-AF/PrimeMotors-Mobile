import multer from "multer";

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const mimeType = (file.mimetype || "").toLowerCase();

    if (!ALLOWED_MIMES.includes(mimeType)) {
      return cb(new Error("Tipo de arquivo não permitido. Envie apenas PNG ou JPG/JPEG."));
    }

    cb(null, true);
  },
});