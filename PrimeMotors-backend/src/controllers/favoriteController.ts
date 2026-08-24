import { Request, Response } from "express";
import type { ParsedQs } from "qs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import {
  createFavorite,
  deleteFavorite,
  findFavorite,
  getFavoritesByUser,
  updateFavoriteMessage,
} from "../services/favoriteService";

const parsePaginationParam = (
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  fallback: number,
) => {
  const pageString = Array.isArray(value) ? value[0] : value;
  const parsed = typeof pageString === "string" ? Number(pageString) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const getUserIdFromRequest = (req: Request) => req.user?.id;

export const listFavoritesController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  const requestedUserId = String(req.params.id || "");

  if (!authenticatedUserId)
    return res.status(401).json({ error: "Não autenticado." });
  if (authenticatedUserId !== requestedUserId)
    return res.status(403).json({ error: "Acesso negado." });

  try {
    const page = parsePaginationParam(req.query.page as any, 1);
    const limit = parsePaginationParam(req.query.limit as any, 10);
    return res
      .status(200)
      .json(await getFavoritesByUser(requestedUserId, page, limit));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar lista de desejos." });
  }
};

export const toggleFavoriteController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId)
    return res.status(401).json({ error: "Não autenticado." });

  const { userId, carId, message } = req.body;
  if (!carId) return res.status(400).json({ error: "carId é obrigatório." });
  if (userId && userId !== authenticatedUserId)
    return res.status(403).json({ error: "O usuário não confere." });

  try {
    const existingFavorite = await findFavorite(authenticatedUserId, carId);
    if (existingFavorite) {
      await deleteFavorite(authenticatedUserId, carId);
      return res.status(200).json({ message: "Favorito removido." });
    }

    const favorite = await createFavorite(authenticatedUserId, carId, message);
    return res.status(201).json({ message: "Favorito adicionado.", favorite });
  } catch (error: any) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return res.status(409).json({ error: "Favorito já existe." });
    return res
      .status(500)
      .json({ error: "Erro ao atualizar lista de desejos." });
  }
};

export const createFavoriteController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId)
    return res.status(401).json({ error: "Não autenticado." });

  const { carId, message } = req.body;
  if (!carId) return res.status(400).json({ error: "carId é obrigatório." });

  try {
    const favorite = await createFavorite(authenticatedUserId, carId, message);
    return res.status(201).json(favorite);
  } catch (error: any) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return res.status(409).json({ error: "Favorito já existe." });
    return res.status(500).json({ error: "Erro ao criar favorito." });
  }
};

export const deleteFavoriteController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId)
    return res.status(401).json({ error: "Não autenticado." });

  const carId = String(req.params.carId || "");
  if (!carId) return res.status(400).json({ error: "carId é obrigatório." });

  try {
    const deleted = await deleteFavorite(authenticatedUserId, carId);
    if (!deleted)
      return res.status(404).json({ error: "Favorito não encontrado." });
    return res.status(200).json({ message: "Favorito removido." });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover favorito." });
  }
};

export const updateFavoriteMessageController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId)
    return res.status(401).json({ error: "Não autenticado." });

  const favoriteId = String(req.params.id || "");
  if (!favoriteId)
    return res.status(400).json({ error: "favoriteId é obrigatório." });

  const { message } = req.body;

  try {
    const updated = await updateFavoriteMessage(
      favoriteId,
      authenticatedUserId,
      message,
    );
    if (!updated)
      return res.status(404).json({ error: "Favorito não encontrado." });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar anotação." });
  }
};
