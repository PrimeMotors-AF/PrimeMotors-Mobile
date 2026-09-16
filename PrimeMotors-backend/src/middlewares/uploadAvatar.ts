import multer from "multer";

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const mimeType = (file.mimetype || "").toLowerCase();

    if (!ALLOWED_MIMES.includes(mimeType)) {
      return cb(
        new Error("Tipo de arquivo não permitido. Envie apenas PNG ou JPG/JPEG.")
      );
    }



    cb(null, true);
  },
});