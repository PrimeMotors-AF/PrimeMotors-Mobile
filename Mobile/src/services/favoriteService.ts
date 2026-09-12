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
    const response = await api.get(`/favorites/${userId}`);

    return response.data;
  },

  toggle: async (payload: FavoriteData) => {
    const response = await api.post(
      "/favorites/toggle",
      payload,
    );

    return response.data;
  },

  create: async (payload: FavoriteCreatePayload) => {
    const response = await api.post(
      "/favorites",
      payload,
    );

    return response.data;
  },

  deleteByCar: async (carId: string) => {
    const response = await api.delete(
      `/favorites/${carId}`,
    );

    return response.data;
  },

  updateMessage: async (
    favoriteId: string,
    payload: FavoriteUpdatePayload,
  ) => {
    const response = await api.patch(
      `/favorites/${favoriteId}/message`,
      payload,
    );

    return response.data;
  },
};
