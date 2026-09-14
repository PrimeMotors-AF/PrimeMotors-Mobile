import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

export async function validateAndUploadAvatar(buffer: Buffer): Promise<string> {
  const { fileTypeFromBuffer } = await import("file-type");
  const type = await fileTypeFromBuffer(buffer);

  if (!type || !ALLOWED_MIMES.includes(type.mime)) {
    throw new Error("Arquivo inválido ou corrompido");
  }

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

  return result.secure_url;
}