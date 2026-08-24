import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Token Não Fornecido" });
  }
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token Malformatado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
      id: string;
      email: string;
    };

    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Token Inválido ou Expirado!" });
  }
  
};
