// Converte erros da aplicação em respostas HTTP padronizadas e logs correlacionados.
import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { ApiError } from "../errors/ApiError";
import { logger } from "../utils/logger";
import { getRouteTemplate } from "./requestLogger";

type ApiErrorResponse = {
  error: string;
  message: string;
  code: string;
  requestId?: string;
  details?: Record<string, unknown>;
};

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new ApiError(409, "CONFLICT", "O registro já existe.");
    }
    if (error.code === "P2025") {
      return new ApiError(404, "NOT_FOUND", "Registro não encontrado.");
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    return new ApiError(400, "INVALID_JSON", "O corpo JSON é inválido.");
  }

  return new ApiError(500, "INTERNAL_SERVER_ERROR", "Erro interno do servidor.");
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "Rota não encontrada."));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const apiError = normalizeError(error);
  const requestId = res.getHeader("X-Request-ID");
  const fields = {
    requestId: typeof requestId === "string" ? requestId : undefined,
    method: req.method,
    route: getRouteTemplate(req),
    statusCode: apiError.statusCode,
    code: apiError.code,
    error,
  };

  if (apiError.statusCode >= 500) {
    logger.error("http.request_failed", fields);
  } else {
    logger.warn("http.request_rejected", fields);
  }

  const response: ApiErrorResponse = {
    error: apiError.message,
    message: apiError.message,
    code: apiError.code,
    ...(typeof requestId === "string" ? { requestId } : {}),
    ...(apiError.details ? { details: apiError.details } : {}),
  };
  for (const [name, value] of Object.entries(apiError.headers ?? {})) {
    res.setHeader(name, value);
  }
  res.status(apiError.statusCode).json(response);
};
