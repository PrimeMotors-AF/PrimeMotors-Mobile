// Representa erros HTTP com status, código e metadados usados pelo middleware da API.
export class ApiError extends Error {
  readonly headers?: Record<string, string | number>;
  readonly details?: Record<string, unknown>;

  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
    options: {
      headers?: Record<string, string | number>;
      details?: Record<string, unknown>;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.headers = options.headers;
    this.details = options.details;
  }
}
