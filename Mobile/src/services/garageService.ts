import type { GarageProposal, GarageProposalPayload } from "../types/types";
import api from "./api";

export interface UpdateProposalPayload {
  offeredValue: number;
  message: string;
}

export type ProposalDecision = "EmAnalise" | "Aceita" | "Recusada";

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
  getAllProposals: async () => {
    const response = await api.get("/garage/admin/proposals");
    const proposals = Array.isArray(response.data) ? response.data : [];
    return proposals.map((proposal: GarageProposal) => ({
      ...proposal,
      offeredValue: Number(proposal.offeredValue),
      date_offer: proposal.date_offer
        ? new Date(proposal.date_offer).toISOString()
        : undefined,
    })) as GarageProposal[];
  },

  updateProposalStatus: async (proposalId: string, status: ProposalDecision) => {
    const response = await api.patch(`/garage/admin/proposals/${proposalId}/status`, { status });
    return response.data;
  },

  deleteAdminProposal: async (proposalId: string) => {
    try {
      const response = await api.delete(`/garage/admin/proposals/${proposalId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível excluir a proposta."),
      );
    }
  },

  getUserProposals: async (userId: string) => {
    try {
      const response = await api.get(`/garage/${userId}`);
      const data = response.data;
      const proposals = Array.isArray(data)
        ? data
        : Array.isArray(data?.proposals)
          ? data.proposals
          : Array.isArray(data?.data)
            ? data.data
            : [];

      return proposals.map((proposal: GarageProposal) => ({
        ...proposal,
        offeredValue: Number(proposal.offeredValue),
        date_offer: proposal.date_offer
          ? new Date(proposal.date_offer).toISOString()
          : undefined,
      })) as GarageProposal[];
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível carregar as propostas."),
      );
    }
  },

  sendCarProposal: async (payload: GarageProposalPayload) => {
    try {
      const response = await api.post("/garage/proposals", payload);
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
      const response = await api.put(`/garage/${proposalId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível atualizar a proposta."),
      );
    }
  },

  deleteCarProposal: async (proposalId: string) => {
    try {
      const response = await api.delete(`/garage/${proposalId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Não foi possível excluir a proposta."),
      );
    }
  },
};

export default garageService;