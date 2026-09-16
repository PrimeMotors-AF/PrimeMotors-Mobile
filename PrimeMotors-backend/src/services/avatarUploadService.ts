import streamifier from "streamifier";
import cloudinary, { assertCloudinaryConfigured } from "../lib/cloudinary";

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];

export async function validateAndUploadAvatar(buffer: Buffer): Promise<string> {
  const { fileTypeFromBuffer } = await import("file-type");
  const type = await fileTypeFromBuffer(buffer);

  if (!type || !ALLOWED_MIMES.includes((type.mime || "").toLowerCase())) {
    throw new Error("Arquivo inválido. Envie apenas PNG ou JPG/JPEG.");
  }

  assertCloudinaryConfigured();

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

  return result.secure_url;
}