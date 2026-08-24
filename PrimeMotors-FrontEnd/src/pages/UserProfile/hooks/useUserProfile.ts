import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { userService } from "../../../services/userService";
import type { UserData } from "../../../types/types";

export const useUserProfile = (id: string | undefined) => {
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<
    "password" | "phone" | "avatar" | null
  >(null);

  const fetchUserProfile = useCallback(async () => {
    if (!id || id === ":id" || id === "undefined") return;
    try {
      const data = await userService.getProfile(id);
      setUserData(data.user ?? data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleUpdate = async (
    field: keyof UserData | "password",
    value: string,
  ) => {
    if (!userData) {
      setNotification({
        message: "Dados do usuário não carregados.",
        variant: "error",
      });
      return;
    }

    try {
      const updatePayload: Record<string, unknown> = {
        [field]: value,
      };

      if (field === "password") {
        updatePayload.name = userData.name;
        updatePayload.cpf = userData.cpf;
        updatePayload.cep = userData.cep;
        updatePayload.number = userData.number;
      }

      if (field === "number") {
        updatePayload.name = userData.name;
        updatePayload.cpf = userData.cpf;
        updatePayload.cep = userData.cep;
      }

      const updatedUser = await userService.updateProfile(id!, updatePayload);
      setUserData(updatedUser as UserData);
      setActiveModal(null);
      setNotification({
        message: "Perfil atualizado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : "Erro ao atualizar.",
        variant: "error",
      });
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!id) return;

    try {
      await userService.updateAvatar(id, url);

      await fetchUserProfile(); // 🔥 ESSENCIAL

      setActiveModal(null);
      setNotification({
        message: "Foto de perfil atualizada!",
        variant: "success",
      });
    } catch (error) {
      setNotification({
        message: "Erro ao salvar a foto no banco.",
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await userService.deleteProfile(id);
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      setNotification({
        message: "Erro ao desativar perfil.",
        variant: "error",
      });
    }
  };

  const handleRemoveAvatar = async () => {
    if (!id) return;

    try {
      await userService.updateAvatar(id, null);

      await fetchUserProfile();

      setNotification({
        message: "Foto removida com sucesso!",
        variant: "success",
      });
    } catch {
      setNotification({
        message: "Erro ao remover foto.",
        variant: "error",
      });
    }
  };

  return {
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
  };
};