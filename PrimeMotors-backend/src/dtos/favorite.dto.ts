// Define e valida os payloads de criação, atualização e alternância de favoritos.
import { parseJsonObject, readOptionalString, readRequiredString } from "./json.dto";

export type CreateFavoriteDto = {
  carId: string;
  message?: string;
};

export type ToggleFavoriteDto = CreateFavoriteDto & {
  userId?: string;
};

export type UpdateFavoriteMessageDto = {
  message?: string | null;
};

export function parseCreateFavoriteDto(value: unknown): CreateFavoriteDto {
  const body = parseJsonObject(value);
  const message = readOptionalString(body, "message");
  return {
    carId: readRequiredString(body, "carId"),
    ...(message !== undefined ? { message } : {}),
  };
}

export function parseToggleFavoriteDto(value: unknown): ToggleFavoriteDto {
  const body = parseJsonObject(value);
  const userId = readOptionalString(body, "userId");
  const message = readOptionalString(body, "message");
  return {
    carId: readRequiredString(body, "carId"),
    ...(userId !== undefined ? { userId } : {}),
    ...(message !== undefined ? { message } : {}),
  };
}

export function parseUpdateFavoriteMessageDto(
  value: unknown,
): UpdateFavoriteMessageDto {
  const body = parseJsonObject(value);
  const message = readOptionalString(body, "message", true);
  return message === undefined ? {} : { message };
}
