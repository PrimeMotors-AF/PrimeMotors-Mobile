import type { Request, Response } from "express";
import { createUserService, loginService } from "../services/userService";
import { parseCreateUserDto, parseLoginDto } from "../dtos/user.dto";
import { ApiError } from "../errors/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const data = parseCreateUserDto(req.body);
  const newUser = await createUserService(data);
  return res.status(201).json({ user: newUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = parseLoginDto(req.body);
  const user = await loginService(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "E-mail ou senha incorretos.");
  }

  if (!user.active) {
    throw new ApiError(
      401,
      "ACCOUNT_INACTIVE",
      "Usuário inexistente ou desativado.",
    );
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  const { password: _, ...userWithoutPassword } = user;
  return res
    .status(200)
    .json({ message: "Login realizado!", token, user: userWithoutPassword });
};
