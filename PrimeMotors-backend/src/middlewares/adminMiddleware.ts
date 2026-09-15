import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true, active: true },
  });

  if (!user?.active || user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }

  return next();
};