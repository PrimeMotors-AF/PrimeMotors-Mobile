import axios from "axios";
import api from "./api";

type UserUpdateData = Partial<Record<string, unknown>>;

export const userService = {
  getProfile: async (id: string) => {
    
    if (!id || id === "undefined") {
      throw new Error("ID do usuário não fornecido");
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao buscar dados do servidor");
    }
  },
  updateProfile: async (id: string, data: UserUpdateData) => {
    const token = localStorage.getItem("token");
    if (!id || id === "undefined") {
      throw new Error("ID do usuário inválido para atualização");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Nenhum dado fornecido para atualização");
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    try {
      // Alterado para caminho relativo
      const response = await axios.patch(
        `/users/${id}`,
        filteredData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      let message = "Erro ao atualizar dados no servidor";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      throw new Error(message);
    }
  },
  updateAvatar: async (id: string, avatarUrl: string | null) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `/users/${id}/avatar`,
      { avatarUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  deleteProfile: (id: string) => api.delete(`/users/${id}`),
};