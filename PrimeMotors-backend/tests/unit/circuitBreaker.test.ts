import {
  CircuitBreaker,
  CircuitBreakerOpenError,
  type CircuitBreakerState,
} from "../../src/services/circuitBreaker";

describe("CircuitBreaker", () => {
  it("opens after the configured consecutive failures and fails fast", async () => {
    const states: CircuitBreakerState[] = [];
    const breaker = new CircuitBreaker({
      failureThreshold: 2,
      resetTimeoutMs: 1_000,
      onStateChange: (state) => states.push(state),
    });
    const operation = jest.fn().mockRejectedValue(new Error("Redis unavailable"));

    await expect(breaker.execute(operation)).rejects.toThrow("Redis unavailable");
    await expect(breaker.execute(operation)).rejects.toThrow("Redis unavailable");
    await expect(breaker.execute(operation)).rejects.toBeInstanceOf(
      CircuitBreakerOpenError,
    );

    expect(operation).toHaveBeenCalledTimes(2);
    expect(breaker.state).toBe("open");
    expect(states).toEqual(["open"]);
  });

  it("allows one half-open probe and closes after it succeeds", async () => {
    let now = 0;
    const states: CircuitBreakerState[] = [];
    const breaker = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 1_000,
      now: () => now,
      onStateChange: (state) => states.push(state),
    });
    const failure = jest.fn().mockRejectedValue(new Error("Redis unavailable"));
    await expect(breaker.execute(failure)).rejects.toThrow("Redis unavailable");

    now = 1_000;
    let completeProbe!: () => void;
    const probe = breaker.execute(
      () =>
        new Promise<void>((resolve) => {
          completeProbe = resolve;
        }),
    );
    await expect(breaker.execute(jest.fn())).rejects.toBeInstanceOf(
      CircuitBreakerOpenError,
    );

    completeProbe();
    await expect(probe).resolves.toBeUndefined();
    expect(breaker.state).toBe("closed");
    expect(states).toEqual(["open", "half-open", "closed"]);
  });

  it("reopens after a failed half-open probe and opens again after the reset timeout", async () => {
    let now = 0;
    const breaker = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 500,
      now: () => now,
    });
    await expect(
      breaker.execute(() => Promise.reject(new Error("first failure"))),
    ).rejects.toThrow("first failure");

    now = 500;
    await expect(
      breaker.execute(() => Promise.reject(new Error("probe failed"))),
    ).rejects.toThrow("probe failed");
    expect(breaker.state).toBe("open");

    now = 999;
    await expect(breaker.execute(jest.fn())).rejects.toBeInstanceOf(
      CircuitBreakerOpenError,
    );
    now = 1_000;
    await expect(breaker.execute(async () => "recovered")).resolves.toBe(
      "recovered",
    );
    expect(breaker.state).toBe("closed");
  });
});
