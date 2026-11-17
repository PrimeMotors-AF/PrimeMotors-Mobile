// Define e valida os payloads de cadastro, login e atualização de perfil.
import { ApiError } from "../errors/ApiError";
import { parseJsonObject, readRequiredString } from "./json.dto";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: string;
  number: string;
}

export interface UpdateUserDto {
  name: string;
  cpf: string;
  cep: string;
  number: string;
  password?: string;
  email?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export function parseCreateUserDto(value: unknown): CreateUserDto {
  const body = parseJsonObject(value);
  const requiredMessage =
    "Nome, email, senha, CPF, CEP e telefone são obrigatórios.";
  return {
    name: readRequiredString(body, "name", requiredMessage),
    email: readRequiredString(body, "email", requiredMessage),
    password: readRequiredString(body, "password", requiredMessage),
    cpf: readRequiredString(body, "cpf", requiredMessage),
    cep: readRequiredString(body, "cep", requiredMessage),
    number: readRequiredString(body, "number", requiredMessage),
  };
}

export function parseLoginDto(value: unknown): LoginDto {
  const body = parseJsonObject(value);
  if (
    typeof body.email !== "string" ||
    body.email.trim().length === 0 ||
    typeof body.password !== "string" ||
    body.password.length === 0
  ) {
    throw new ApiError(
      400,
      "INVALID_REQUEST",
      "Email e senha são obrigatórios.",
    );
  }
  return {
    email: body.email,
    password: body.password,
  };
}

export function parseUpdateUserDto(value: unknown): UpdateUserDto {
  const body = parseJsonObject(value);
  const requiredMessage =
    "Nome, CPF, CEP e número são obrigatórios para atualização.";
  const password = body.password;
  const email = body.email;
  if (password !== undefined && typeof password !== "string") {
    throw new ApiError(400, "INVALID_REQUEST", "Senha inválida.");
  }
  if (email !== undefined && typeof email !== "string") {
    throw new ApiError(400, "INVALID_REQUEST", "Email inválido.");
  }
  return {
    name: readRequiredString(body, "name", requiredMessage),
    cpf: readRequiredString(body, "cpf", requiredMessage),
    cep: readRequiredString(body, "cep", requiredMessage),
    number: readRequiredString(body, "number", requiredMessage),
    ...(password !== undefined ? { password } : {}),
    ...(email !== undefined ? { email } : {}),
  };
}
