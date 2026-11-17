// Fornece validações comuns para objetos JSON e campos de texto recebidos pela API.
import { ApiError } from "../errors/ApiError";

export type JsonObject = Record<string, unknown>;

export function parseJsonObject(
  value: unknown,
  message = "Corpo da requisição inválido.",
): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ApiError(400, "INVALID_REQUEST", message);
  }
  return value as JsonObject;
}

export function readRequiredString(
  object: JsonObject,
  key: string,
  message = `${key} é obrigatório.`,
): string {
  const value = object[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, "INVALID_REQUEST", message);
  }
  return value;
}

export function readOptionalString(
  object: JsonObject,
  key: string,
  allowNull: true,
): string | null | undefined;
export function readOptionalString(
  object: JsonObject,
  key: string,
  allowNull?: false,
): string | undefined;
export function readOptionalString(
  object: JsonObject,
  key: string,
  allowNull = false,
): string | null | undefined {
  const value = object[key];
  if (value === undefined) {
    return undefined;
  }
  if (allowNull && value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new ApiError(
      400,
      "INVALID_REQUEST",
      `${key} deve ser um texto.`,
    );
  }
  return value;
}
