// Define e valida os payloads de criação, edição e mudança de status de propostas.
import { ApiError } from "../errors/ApiError";
import {
  parseJsonObject,
  readOptionalString,
  readRequiredString,
} from "./json.dto";

export type CreateProposalDto = {
  carId: string;
  offeredValue: number;
  message?: string | null;
};

export type UpdateProposalDto = {
  offeredValue: number;
  message?: string | null;
};

export type UpdateProposalStatusDto = {
  status: "EmAnalise" | "Aceita" | "Recusada";
};

function readOfferedValue(body: Record<string, unknown>): number {
  const value = body.offeredValue;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ApiError(400, "INVALID_REQUEST", "offeredValue inválido.");
  }
  return value;
}

export function parseCreateProposalDto(value: unknown): CreateProposalDto {
  const body = parseJsonObject(value);
  const message = readOptionalString(body, "message", true);
  return {
    carId: readRequiredString(body, "carId"),
    offeredValue: readOfferedValue(body),
    ...(message !== undefined ? { message } : {}),
  };
}

export function parseUpdateProposalDto(value: unknown): UpdateProposalDto {
  const body = parseJsonObject(value);
  const message = readOptionalString(body, "message", true);
  return {
    offeredValue: readOfferedValue(body),
    ...(message !== undefined ? { message } : {}),
  };
}

export function parseUpdateProposalStatusDto(
  value: unknown,
): UpdateProposalStatusDto {
  const body = parseJsonObject(value);
  const status = readRequiredString(body, "status", "Status inválido.");
  if (status !== "EmAnalise" && status !== "Aceita" && status !== "Recusada") {
    throw new ApiError(400, "INVALID_REQUEST", "Status inválido.");
  }
  return { status };
}
