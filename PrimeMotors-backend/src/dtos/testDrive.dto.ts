// Define e valida os dados de criação e atualização de agendamentos de test drive.
import { ApiError } from "../errors/ApiError";
import {
  parseJsonObject,
  readOptionalString,
  readRequiredString,
} from "./json.dto";

export type CreateTestDriveDto = {
  carId: string;
  scheduledAt: string;
  message?: string;
};

export type UpdateTestDriveDto = {
  scheduledAt?: string;
  message?: string;
};

function validateDate(value: string): string {
  if (Number.isNaN(Date.parse(value))) {
    throw new ApiError(400, "INVALID_REQUEST", "scheduledAt inválido.");
  }
  return value;
}

export function parseCreateTestDriveDto(value: unknown): CreateTestDriveDto {
  const body = parseJsonObject(value);
  const message = readOptionalString(body, "message");
  return {
    carId: readRequiredString(body, "carId"),
    scheduledAt: validateDate(
      readRequiredString(body, "scheduledAt", "scheduledAt é obrigatório."),
    ),
    ...(message !== undefined ? { message } : {}),
  };
}

export function parseUpdateTestDriveDto(value: unknown): UpdateTestDriveDto {
  const body = parseJsonObject(value);
  const scheduledAt = readOptionalString(body, "scheduledAt");
  const message = readOptionalString(body, "message");
  return {
    ...(scheduledAt !== undefined
      ? { scheduledAt: validateDate(scheduledAt) }
      : {}),
    ...(message !== undefined ? { message } : {}),
  };
}
