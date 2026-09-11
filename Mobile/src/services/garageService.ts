import type { GarageProposalPayload } from "../types/types";
import api from "./api";

export interface UpdateProposalPayload {
  offeredValue: number;
  message: string;
}

// Mensagem amigável para exibir quando a chamada falhar (rede instável, timeout, etc.)
function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code === "ECONNABORTED") {
      return "Tempo de conexão esgotado. Verifique sua internet e tente novamente.";
    }
    if (code === "ERR_NETWORK") {
      return "Sem conexão com o servidor. Verifique sua internet.";
    }
  }

  return fallback;
}

const garageService = {
  getUserProposals: async (userId: string) => {
    try {
      const response = await api.get(`/Garage/${userId}`);
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.proposals)) return data.proposals;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível carregar as propostas."),
      );
    }
  },

  sendCarProposal: async (payload: GarageProposalPayload) => {
    try {
      const response = await api.post("/Garage/proposals", payload);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível enviar a proposta."),
      );
    }
  },

  updateCarProposal: async (
    proposalId: string,
    payload: UpdateProposalPayload,
  ) => {
    try {
      const response = await api.put(`/Garage/${proposalId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível atualizar a proposta."),
      );
    }
  },

  deleteCarProposal: async (proposalId: string) => {
    try {
      const response = await api.delete(`/Garage/${proposalId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível excluir a proposta."),
      );
    }
  },
};

export default garageService;