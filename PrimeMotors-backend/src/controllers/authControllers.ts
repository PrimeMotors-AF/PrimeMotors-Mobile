import { Request, Response } from "express";
import { createUserService, loginService } from "../services/userService";
import type { CreateUserInput, LoginInput } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateUserInput;
    const newUser = await createUserService(data);
    return res.status(201).json({ user: newUser });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const user = await loginService(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    if (!user.active) {
      return res
        .status(401)
        .json({ message: "Usuário inexistente ou desativado." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    const { password: _, ...userWithoutPassword } = user;
    return res
      .status(200)
      .json({ message: "Login realizado!", token, user: userWithoutPassword });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno no servidor";
    return res.status(500).json({ message });
  }
};
