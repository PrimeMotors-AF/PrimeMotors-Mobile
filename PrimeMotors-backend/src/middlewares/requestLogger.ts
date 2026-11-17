import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

function getRouteTemplate(req: Request): string {
  const routePath = req.route?.path;
  if (!routePath) {
    return "unmatched";
  }

  const path = Array.isArray(routePath) ? routePath.join("|") : routePath;
  return `${req.baseUrl}${path}` || "/";
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startedAt = process.hrtime.bigint();
  const incomingRequestId = req.get("x-request-id");
  const requestId =
    incomingRequestId && /^[A-Za-z0-9._-]{1,128}$/.test(incomingRequestId)
      ? incomingRequestId
      : randomUUID();

  res.setHeader("X-Request-ID", requestId);

  let logged = false;
  const logRequest = (responseCompleted: boolean) => {
    if (logged) {
      return;
    }

    logged = true;
    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        event: "http.request",
        requestId,
        method: req.method,
        route: getRouteTemplate(req),
        statusCode: res.statusCode,
        durationMs,
        responseCompleted,
      }),
    );
  };

  res.once("finish", () => logRequest(true));
  res.once("close", () => {
    if (!res.writableFinished) {
      logRequest(false);
    }
  });

  next();
}
