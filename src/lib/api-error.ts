import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

type ApiErrorBody = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

function createApiErrorBody(code: ApiErrorCode, message: string): ApiErrorBody {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  init?: { headers?: HeadersInit }
): NextResponse {
  return NextResponse.json(createApiErrorBody(code, message), {
    status,
    headers: init?.headers,
  });
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return apiError("UNAUTHORIZED", message, 401);
}

export function badRequest(message: string): NextResponse {
  return apiError("BAD_REQUEST", message, 400);
}

export function notFound(message: string): NextResponse {
  return apiError("NOT_FOUND", message, 404);
}

export function internalServerError(message = "Internal server error"): NextResponse {
  return apiError("INTERNAL_ERROR", message, 500);
}

function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

export function mapErrorToApiResponse(
  error: unknown,
  fallbackMessage: string
): NextResponse {
  const message = hasMessage(error) ? error.message : "";
  const normalized = message.toLowerCase();

  if (normalized.includes("unauthorized")) {
    return unauthorized("Unauthorized");
  }

  if (normalized.includes("not found")) {
    return notFound(message || "Resource not found");
  }

  if (
    normalized.includes("invalid") ||
    normalized.includes("required") ||
    normalized.includes("malformed") ||
    normalized.includes("validation")
  ) {
    return badRequest(message || "Invalid request payload");
  }

  return internalServerError(fallbackMessage);
}
