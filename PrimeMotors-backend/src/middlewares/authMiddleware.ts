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
    console.log("1. SECRET NO MIDDLEWARE:", process.env.JWT_SECRET);
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
      id: string;
      email: string;
      role?: "user" | "admin";
    };

    req.user = payload;
    return next();
  } catch(error:any) {
    console.log("2. ERRO DO JWT:", error.message);
    return res.status(401).json({ message: "Token Inválido ou Expirado!" });
  }
  
};
