import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | null> | RateLimitEntry | null;
  set(
    key: string,
    entry: RateLimitEntry,
    ttlMs: number
  ): Promise<void> | void;
  delete?(key: string): Promise<void> | void;
}

export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly expirations = new Map<string, number>();

  get(key: string): RateLimitEntry | null {
    const expiresAt = this.expirations.get(key);
    if (expiresAt !== undefined && Date.now() >= expiresAt) {
      this.entries.delete(key);
      this.expirations.delete(key);
      return null;
    }
    return this.entries.get(key) ?? null;
  }

  set(key: string, entry: RateLimitEntry, ttlMs: number): void {
    this.entries.set(key, entry);
    this.expirations.set(key, Date.now() + ttlMs);
  }

  delete(key: string): void {
    this.entries.delete(key);
    this.expirations.delete(key);
  }
}

function resolveMaybePromise<T>(value: Promise<T> | T): Promise<T> {
  return Promise.resolve(value);
}

/**
 * Simple in-memory sliding-window rate limiter.
 * Each instance maintains its own counter map keyed by identifier (IP or user ID).
 * Stale entries are lazily cleaned up.
 */
export function createRateLimiter({ limit, windowSeconds }: RateLimiterOptions) {
  const store = new InMemoryRateLimitStore();

  return createRateLimiterWithStore({ limit, windowSeconds }, store);
}

export function createRateLimiterWithStore(
  { limit, windowSeconds }: RateLimiterOptions,
  store: RateLimitStore
) {
  const windowMs = windowSeconds * 1000;

  return {
    /**
     * Check if a request is allowed for the given key.
     * Returns { allowed: true } or { allowed: false, retryAfterSeconds }.
     */
    async check(
      key: string
    ): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
      const now = Date.now();
      const entry = await resolveMaybePromise(store.get(key));

      if (!entry || now >= entry.resetTime) {
        // First request in a new window
        await resolveMaybePromise(
          store.set(key, { count: 1, resetTime: now + windowMs }, windowMs)
        );
        return { allowed: true };
      }

      if (entry.count < limit) {
        const nextEntry = {
          count: entry.count + 1,
          resetTime: entry.resetTime,
        };
        await resolveMaybePromise(
          store.set(key, nextEntry, Math.max(entry.resetTime - now, 0))
        );
        return { allowed: true };
      }

      const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    },
  };
}

/**
 * Extract a client identifier from headers.
 * Uses x-forwarded-for (set by reverse proxies like Vercel), falls back to "anonymous".
 */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

/**
 * Standard 429 Too Many Requests response.
 */
export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}
