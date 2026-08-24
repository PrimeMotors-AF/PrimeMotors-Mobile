import axios from "axios";
const API_URL = "/auth";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, credentials);
      return data;
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Erro no servidor";
      throw new Error(message || "Erro ao conectar");
    }
  }
};