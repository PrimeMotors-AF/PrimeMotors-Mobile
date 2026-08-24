import { Request, Response } from "express";
import type { UpdateUserInput } from "../types/user";
import {
  getUserByIdService,
  updateUserService,
  deactivateUserService,
  updateUserAvatarService,
} from "../services/userService";

export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  try {
    const user = await getUserByIdService(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado no banco" });
    }

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const tokenUserId = req.user?.id;
    const id = req.params.id as string;

    if (!tokenUserId || tokenUserId !== id) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const updatedUser = await updateUserService(
      id,
      req.body as UpdateUserInput,
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error instanceof Error &&
      error.message.includes("Não é permitido alterar o email")
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (
      error instanceof Error &&
      (error.message.includes("obrigatórios") ||
        error.message.includes("inválido"))
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao atualizar" });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const tokenUserId = req.user?.id;
    const id = req.params.id as string;

    if (!tokenUserId || tokenUserId !== id) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    await deactivateUserService(id);
    return res.status(200).json({ message: "Usuário desativado" });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao deletar" });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    //apenas o próprio usuário possa alterar seu avatar
    const tokenUserId = req.user?.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    console.log("USER DO MIDDLEWARE:", req.user);
    if (!tokenUserId || tokenUserId !== id) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    const { avatarUrl } = req.body;

    const user = await updateUserAvatarService(
      id,
      avatarUrl ?? null
    );

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro no updateAvatar:", error);
    return res.status(500).json({ message: "Erro ao atualizar avatar" });
  }
};
