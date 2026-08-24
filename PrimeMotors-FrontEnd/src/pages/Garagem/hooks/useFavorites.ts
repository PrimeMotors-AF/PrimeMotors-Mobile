import { useState, useEffect, useCallback } from "react";

import { favoriteService } from "../../../services/favoriteService";
import type { CardGarageProps } from "../../../types/types";

export default function useFavorites(userId: string) {
  const [favorites, setFavorites] = useState<CardGarageProps[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const favData = await favoriteService.getByUser(userId);
      setFavorites(favData);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadData();
  }, [userId, loadData]);

  const handleToggleFavorite = async (carId: string) => {
    try {
      await favoriteService.toggle({ userId, carId });
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      throw error;
    }
  };

  return { favorites, loading, handleToggleFavorite, refresh: loadData };
}
