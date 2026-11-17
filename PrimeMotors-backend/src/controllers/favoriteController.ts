import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  parseCreateFavoriteDto,
  parseToggleFavoriteDto,
  parseUpdateFavoriteMessageDto,
} from "../dtos/favorite.dto";
import { parsePaginationParam } from "../dtos/pagination.dto";
import { ApiError } from "../errors/ApiError";
import {
  createFavorite,
  deleteFavorite,
  findFavorite,
  getFavoritesByUser,
  updateFavoriteMessage,
} from "../services/favoriteService";

function getUserIdFromRequest(req: Request): string | undefined {
  return req.user?.id;
}

function handleFavoriteError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new ApiError(409, "CONFLICT", "Favorito já existe.");
  }
  throw error;
}

export const listFavoritesController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  const requestedUserId = String(req.params.id || "");

  if (!authenticatedUserId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }
  if (authenticatedUserId !== requestedUserId) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }

  const page = parsePaginationParam(req.query.page, 1);
  const limit = parsePaginationParam(req.query.limit, 10);
  return res
    .status(200)
    .json(await getFavoritesByUser(requestedUserId, page, limit));
};

export const toggleFavoriteController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const { userId, carId, message } = parseToggleFavoriteDto(req.body);
  if (userId && userId !== authenticatedUserId) {
    throw new ApiError(403, "FORBIDDEN", "O usuário não confere.");
  }

  try {
    const existingFavorite = await findFavorite(authenticatedUserId, carId);
    if (existingFavorite) {
      await deleteFavorite(authenticatedUserId, carId);
      return res.status(200).json({ message: "Favorito removido." });
    }

    const favorite = await createFavorite(authenticatedUserId, carId, message);
    return res.status(201).json({ message: "Favorito adicionado.", favorite });
  } catch (error) {
    return handleFavoriteError(error);
  }
};

export const createFavoriteController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const { carId, message } = parseCreateFavoriteDto(req.body);
  try {
    const favorite = await createFavorite(authenticatedUserId, carId, message);
    return res.status(201).json(favorite);
  } catch (error) {
    return handleFavoriteError(error);
  }
};

export const deleteFavoriteController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const carId = String(req.params.carId || "");
  if (!carId) {
    throw new ApiError(400, "INVALID_REQUEST", "carId é obrigatório.");
  }

  const deleted = await deleteFavorite(authenticatedUserId, carId);
  if (!deleted) {
    throw new ApiError(404, "NOT_FOUND", "Favorito não encontrado.");
  }
  return res.status(200).json({ message: "Favorito removido." });
};

export const updateFavoriteMessageController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const favoriteId = String(req.params.id || "");
  if (!favoriteId) {
    throw new ApiError(400, "INVALID_REQUEST", "favoriteId é obrigatório.");
  }

  const { message } = parseUpdateFavoriteMessageDto(req.body);
  const updated = await updateFavoriteMessage(
    favoriteId,
    authenticatedUserId,
    message,
  );
  if (!updated) {
    throw new ApiError(404, "NOT_FOUND", "Favorito não encontrado.");
  }
  return res.status(200).json(updated);
};
