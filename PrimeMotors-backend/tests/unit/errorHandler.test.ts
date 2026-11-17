import express from "express";
import request from "supertest";
import { ApiError } from "../../src/errors/ApiError";
import { errorHandler, notFoundHandler } from "../../src/middlewares/errorHandler";
import { requestLogger } from "../../src/middlewares/requestLogger";

describe("errorHandler", () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("returns a compatible error envelope with a request ID for known errors", async () => {
    const app = express();
    app.use(requestLogger);
    app.get("/resource/:id", () => {
      throw new ApiError(400, "INVALID_REQUEST", "Requisição inválida.");
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app)
      .get("/resource/private-id")
      .set("X-Request-ID", "request-456");

    expect(response.status).toBe(400);
    expect(response.headers["x-request-id"]).toBe("request-456");
    expect(response.body).toEqual({
      error: "Requisição inválida.",
      message: "Requisição inválida.",
      code: "INVALID_REQUEST",
      requestId: "request-456",
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).not.toContain("private-id");
  });

  it("hides unexpected error details from clients and logs the request context", async () => {
    const app = express();
    app.use(requestLogger);
    app.get("/failure", () => {
      throw new Error("database credentials must not reach the client");
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get("/failure");

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: "Erro interno do servidor.",
      message: "Erro interno do servidor.",
      code: "INTERNAL_SERVER_ERROR",
    });
    expect(response.body.message).not.toContain("credentials");
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toContain("database credentials");
  });
});
