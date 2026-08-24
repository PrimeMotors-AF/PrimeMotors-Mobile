import type { FavoriteData } from "../types/types";
import api from "./api";

export interface FavoriteCreatePayload {
  carId: string;
  message?: string;
}

export interface FavoriteUpdatePayload {
  message?: string;
}

export const favoriteService = {
  getByUser: async (userId: string) => {
    const response = await api.get(`/Favorites/${userId}`);
    return response.data;
  },

  toggle: async (payload: FavoriteData) => {
    const response = await api.post("/Favorites/toggle", payload);
    return response.data;
  },

  create: async (payload: FavoriteCreatePayload) => {
    const response = await api.post("/Favorites", payload);
    return response.data;
  },

  deleteByCar: async (carId: string) => {
    const response = await api.delete(`/Favorites/${carId}`);
    return response.data;
  },

  updateMessage: async (favoriteId: string, payload: FavoriteUpdatePayload) => {
    const response = await api.patch(
      `/Favorites/${favoriteId}/message`,
      payload,
    );
    return response.data;
  },
};