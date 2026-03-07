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

/**
 * Simple in-memory sliding-window rate limiter.
 * Each instance maintains its own counter map keyed by identifier (IP or user ID).
 * Stale entries are lazily cleaned up.
 */
export function createRateLimiter({ limit, windowSeconds }: RateLimiterOptions) {
  const entries = new Map<string, RateLimitEntry>();
  const windowMs = windowSeconds * 1000;

  // Periodic cleanup of expired entries to prevent memory leaks (every 60s)
  const CLEANUP_INTERVAL = 60_000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of entries) {
      if (now >= entry.resetTime) {
        entries.delete(key);
      }
    }
  }

  return {
    /**
     * Check if a request is allowed for the given key.
     * Returns { allowed: true } or { allowed: false, retryAfterSeconds }.
     */
    check(key: string): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
      cleanup();
      const now = Date.now();
      const entry = entries.get(key);

      if (!entry || now >= entry.resetTime) {
        // First request in a new window
        entries.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true };
      }

      if (entry.count < limit) {
        entry.count++;
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
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}
