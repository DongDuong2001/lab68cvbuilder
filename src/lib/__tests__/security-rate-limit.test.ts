import assert from "node:assert";
import { describe, it } from "node:test";
import {
  createRateLimiter,
  createRateLimiterWithStore,
  type RateLimitStore,
  rateLimitResponse,
} from "../rate-limit";

describe("security-rate-limit", () => {
  it("blocks requests after limit is exceeded", async () => {
    const limiter = createRateLimiter({ limit: 2, windowSeconds: 60 });

    const first = await limiter.check("ip:127.0.0.1");
    const second = await limiter.check("ip:127.0.0.1");
    const third = await limiter.check("ip:127.0.0.1");

    assert.strictEqual(first.allowed, true);
    assert.strictEqual(second.allowed, true);
    assert.strictEqual(third.allowed, false);
    if (!third.allowed) {
      assert.ok(third.retryAfterSeconds > 0);
    }
  });

  it("supports custom store adapters for distributed backends", async () => {
    const sharedState = new Map<string, { count: number; resetTime: number; expiresAt: number }>();

    const distributedStore: RateLimitStore = {
      get(key) {
        const entry = sharedState.get(key);
        if (!entry || Date.now() >= entry.expiresAt) {
          sharedState.delete(key);
          return null;
        }
        return { count: entry.count, resetTime: entry.resetTime };
      },
      set(key, entry, ttlMs) {
        sharedState.set(key, {
          count: entry.count,
          resetTime: entry.resetTime,
          expiresAt: Date.now() + ttlMs,
        });
      },
      delete(key) {
        sharedState.delete(key);
      },
    };

    const limiter = createRateLimiterWithStore(
      { limit: 1, windowSeconds: 60 },
      distributedStore
    );

    const first = await limiter.check("ip:10.0.0.2");
    const second = await limiter.check("ip:10.0.0.2");

    assert.strictEqual(first.allowed, true);
    assert.strictEqual(second.allowed, false);
  });

  it("returns standardized rate limit response payload", async () => {
    const response = rateLimitResponse(42);
    const body = (await response.json()) as {
      ok: boolean;
      error: { code: string; message: string };
    };

    assert.strictEqual(response.status, 429);
    assert.strictEqual(response.headers.get("Retry-After"), "42");
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.error.code, "RATE_LIMITED");
  });
});
