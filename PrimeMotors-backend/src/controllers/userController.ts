import type { Request, Response } from "express";
import {
  deactivateUserService,
  getUserByIdService,
  updateUserAvatarService,
  updateUserService,
} from "../services/userService";
import { validateAndUploadAvatar } from "../services/avatarUploadService";
import { parseUpdateUserDto } from "../dtos/user.dto";
import { parseJsonObject } from "../dtos/json.dto";
import { ApiError } from "../errors/ApiError";

const userIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getRouteId(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function assertOwnUser(req: Request): string {
  const id = getRouteId(req);
  if (!req.user?.id || req.user.id !== id) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }
  return id;
}

function getUploadedAvatar(req: Request) {
  if (req.file) {
    return req.file;
  }
  if (req.files && !Array.isArray(req.files)) {
    return Object.values(req.files).flat()[0];
  }
  return undefined;
}

export const getUserController = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !userIdPattern.test(id)) {
    throw new ApiError(400, "INVALID_USER_ID", "ID de usuário inválido.");
  }

  const user = await getUserByIdService(id);
  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "Usuário não encontrado no banco.");
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  return res.json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const id = assertOwnUser(req);
  const updatedUser = await updateUserService(
    id,
    parseUpdateUserDto(req.body),
  );
  return res.status(200).json(updatedUser);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const id = assertOwnUser(req);
  await deactivateUserService(id);
  return res.status(200).json({ message: "Usuário desativado" });
};

export const updateAvatar = async (req: Request, res: Response) => {
  const id = assertOwnUser(req);
  const file = getUploadedAvatar(req);

  if (!file) {
    const body = parseJsonObject(req.body ?? {});
    if (body.avatarUrl === null || body.avatarUrl === undefined) {
      const user = await updateUserAvatarService(id, null);
      return res.status(200).json(user);
    }
    throw new ApiError(400, "AVATAR_REQUIRED", "Nenhum arquivo enviado.");
  }

  let secureUrl: string;
  try {
    secureUrl = await validateAndUploadAvatar(file.buffer);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("inválido")
    ) {
      throw new ApiError(400, "INVALID_AVATAR", error.message);
    }
    throw error;
  }

  const user = await updateUserAvatarService(id, secureUrl);
  return res.status(200).json(user);
};
