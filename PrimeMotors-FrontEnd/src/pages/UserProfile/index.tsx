import { useState } from "react";

import Notification from "../../components/Notification";
import {
  Button,
  InfoRow,
  LoginExpired,
  Loading,
  Modal,
  EditFieldForm,
  useUserProfile,
  useParams,
  isTokenExpired,
  AvatarUploadForm,
} from "./Components";

const UserProfile = () => {

  const { id } = useParams<{ id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    userData,
    isLoading,
    activeModal,
    setActiveModal,
    handleUpdate,
    handleUpdateAvatar,
    handleRemoveAvatar,
    handleDelete,
    notification,
    setNotification,
  } = useUserProfile(id);
  if (isLoading) {
    return <Loading />;
  }

  if (isTokenExpired()) {
    return <LoginExpired />;
  }

  return (
    <div className="bg-[#121212] text-white font-sans  py-20! ">
      <Notification
        message={notification?.message ?? ""}
        variant={notification?.variant ?? "success"}
        onClose={() => setNotification(null)}
      />
      <div className="max-w-5xl mx-auto px-4 ">
        <header className="mb-8 pb-2 ">
          <h1 className="text-2xl font-light tracking-widest uppercase border-l-4 pl-2! border-[#C59958]">
            Meu Perfil
          </h1>
        </header>
        <div className="flex flex-col items-center justify-center gap-4 mt-6 mb-6">

          {userData?.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt="Foto de perfil"
              className="w-36 h-36 rounded-full object-cover border border-[#C59958]"
            />
          ) : (
            <div className="w-36 h-36 rounded-full border border-[#C59958] flex items-center justify-center bg-gray-100 text-gray-500">
              <span className="text-sm">Sem foto</span>
            </div>
          )}

          <button
            onClick={() => setActiveModal("avatar")}
            className="text-[#C59958] hover:underline"
          >
            Trocar foto
          </button>
          {userData?.avatarUrl && (
            <button
              onClick={handleRemoveAvatar}
              className="text-red-500 hover:underline text-sm"
            >
              Remover foto
            </button>
          )}
        </div>
        <main className="border border-gray-700 p-1 bg-[#12121269]">
          <section className="p-6 border-b border-gray-800">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Usuário
            </span>

            <h2 className="text-3xl italic font-semibold mt-1">
              {userData?.name}
            </h2>

          </section>
          <div className="p-6 space-y-4">
            <InfoRow label="Email" value={userData?.email || ""} />
            <InfoRow
              label="Senha"
              value="••••••••••••••"
              onEdit={() => setActiveModal("password")}
            />
            <InfoRow label="CEP" value={userData?.cep || ""} />
            <InfoRow label="CPF" value={userData?.cpf || ""} />
            <InfoRow
              label="Telefone"
              value={userData?.number || ""}
              onEdit={() => setActiveModal("phone")}
            />
          </div>
        </main>
        <Button
          texto="Deletar Perfil"
          className="hover:text-red-700 my-1"
          onClick={() => setShowDeleteConfirm(true)}
        />
      </div>

      {showDeleteConfirm ? (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/20 p-6! max-w-md w-full">
            <p className="text-white mb-6">Deseja desativar seu perfil?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
        <h3 className="text-xl tracking-[0.2em] uppercase mb-8 font-light text-white">
          {activeModal === "password" ? "Segurança"
            : activeModal === "avatar" ? "Atualizar Foto"
              : "Contato"}
        </h3>

        {activeModal === "avatar" ? (
          // Aqui você chama o componente que criamos para o upload
          <AvatarUploadForm onUpload={handleUpdateAvatar} />
        ) : (
          // Aqui continua a lógica dos outros campos
          <EditFieldForm
            config={{
              label: activeModal === "password" ? "Nova Senha" : "Novo Telefone",
              type: activeModal === "password" ? "password" : "text",
              defaultValue: activeModal === "phone" ? userData?.number : "",
              maxLength: activeModal === "phone" ? 13 : 20,
            }}
            onSave={(val) =>
              handleUpdate(
                activeModal === "password" ? "password" : "number",
                val,
              )
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default UserProfile;
