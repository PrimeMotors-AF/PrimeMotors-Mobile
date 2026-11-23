// Converte parâmetros de paginação da query em valores numéricos positivos.
import type { ParsedQs } from "qs";

export type PaginationValue =
  | string
  | ParsedQs
  | Array<string | ParsedQs>
  | undefined;

export type PaginationQueryDto = {
  page?: PaginationValue;
  limit?: PaginationValue;
};

export function parsePaginationParam(
  value: PaginationValue,
  fallback: number,
): number {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const parsed =
    typeof firstValue === "string" ? Number(firstValue) : Number.NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
