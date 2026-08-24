import { useState } from "react";
import type { AvatarUploadFormProps } from "../../../types/types";
import type { ChangeEvent } from "react";
export const AvatarUploadForm = ({ onUpload }: AvatarUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFile(e.target.files[0]);
  }
};

  const uploadToCloudinary = async () => {
    const handleSubmit = async () => {
      if (!file) {
        console.log("Nenhum arquivo selecionado");
        return;
      }
    const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "avatar_prime_motors"); // Configurado no Cloudinary

      const response = await fetch("https://api.cloudinary.com/v1_1/dchrzl7ao/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      onUpload(data.secure_url);
    };

    return (
      <div className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={uploadToCloudinary} className="bg-[#C59958] text-black px-4 py-2">
          Salvar Foto
        </button>
      </div>
    );
  };
};