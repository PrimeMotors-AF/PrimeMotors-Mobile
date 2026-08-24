import type { GarageProposalPayload } from "../types/types";
import api from "./api";

export interface UpdateProposalPayload {
  offeredValue: number;
  message: string;
}

const garageService = {
  getUserProposals: async (userId: string) => {
    const response = await api.get(`/Garage/${userId}`);
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.proposals)) return data.proposals;
    if (Array.isArray(data?.data)) return data.data;
    console.log("garage raw response:", response.data); 
    return [];
  },

  sendCarProposal: async (payload: GarageProposalPayload) => {
    const response = await api.post("/Garage/proposals", payload);
    return response.data;
  },

  updateCarProposal: async (
    proposalId: string,
    payload: UpdateProposalPayload,
  ) => {
    const response = await api.put(`/Garage/${proposalId}`, payload);
    return response.data;
  },

  deleteCarProposal: async (proposalId: string) => {
    const response = await api.delete(`/Garage/${proposalId}`);
    return response.data;
  },
};

export default garageService;