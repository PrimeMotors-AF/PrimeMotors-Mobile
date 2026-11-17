import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { ApiError } from "../errors/ApiError";

export const adminMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user?.id) {
    return next(new ApiError(401, "UNAUTHORIZED", "Não autenticado."));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true, active: true },
  });

  if (!user?.active || user.role !== "admin") {
    return next(
      new ApiError(403, "FORBIDDEN", "Acesso restrito a administradores."),
    );
  }

  return next();
};