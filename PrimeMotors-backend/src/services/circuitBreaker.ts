// Protege operações externas contra falhas repetidas usando os estados fechado, aberto e half-open.
export type CircuitBreakerState = "closed" | "open" | "half-open";

export class CircuitBreakerOpenError extends Error {
  readonly code = "CIRCUIT_BREAKER_OPEN";

  constructor(readonly retryAfterMs: number) {
    super("Circuit breaker is open.");
    this.name = "CircuitBreakerOpenError";
  }
}

type CircuitBreakerOptions = {
  failureThreshold: number;
  resetTimeoutMs: number;
  now?: () => number;
  onStateChange?: (state: CircuitBreakerState) => void;
};

export class CircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;
  private probeInProgress = false;
  private generation = 0;
  private readonly now: () => number;

  constructor(private readonly options: CircuitBreakerOptions) {
    if (
      !Number.isInteger(options.failureThreshold) ||
      options.failureThreshold < 1 ||
      !Number.isInteger(options.resetTimeoutMs) ||
      options.resetTimeoutMs < 1
    ) {
      throw new Error(
        "Circuit breaker threshold and reset timeout must be positive integers.",
      );
    }

    this.now = options.now ?? Date.now;
  }

  get state(): CircuitBreakerState {
    if (this.openedAt === null) {
      return "closed";
    }

    return this.now() - this.openedAt >= this.options.resetTimeoutMs
      ? "half-open"
      : "open";
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.openedAt !== null) {
      const elapsedMs = this.now() - this.openedAt;
      if (elapsedMs < this.options.resetTimeoutMs || this.probeInProgress) {
        throw new CircuitBreakerOpenError(
          Math.max(1, this.options.resetTimeoutMs - elapsedMs),
        );
      }

      this.probeInProgress = true;
      this.options.onStateChange?.("half-open");
      try {
        const result = await operation();
        this.failures = 0;
        this.openedAt = null;
        this.generation += 1;
        this.options.onStateChange?.("closed");
        return result;
      } catch (error) {
        this.openedAt = this.now();
        this.generation += 1;
        this.options.onStateChange?.("open");
        throw error;
      } finally {
        this.probeInProgress = false;
      }
    }

    const operationGeneration = this.generation;
    try {
      const result = await operation();
      if (this.generation === operationGeneration && this.openedAt === null) {
        this.failures = 0;
      }
      return result;
    } catch (error) {
      if (this.generation === operationGeneration && this.openedAt === null) {
        this.failures += 1;
        if (this.failures >= this.options.failureThreshold) {
          this.openedAt = this.now();
          this.generation += 1;
          this.options.onStateChange?.("open");
        }
      }
      throw error;
    }
  }

  reset(): void {
    this.failures = 0;
    this.openedAt = null;
    this.probeInProgress = false;
    this.generation += 1;
  }
}
