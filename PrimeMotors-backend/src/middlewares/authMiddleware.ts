import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(new ApiError(401, "UNAUTHORIZED", "Token não fornecido."));
  }
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "UNAUTHORIZED", "Token malformado."));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
      id: string;
      email: string;
      role?: "user" | "admin";
    };

    req.user = payload;
    return next();
  } catch {
    return next(new ApiError(401, "UNAUTHORIZED", "Token inválido ou expirado."));
  }
  
};
