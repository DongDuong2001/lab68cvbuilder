import assert from "node:assert";
import { describe, it } from "node:test";
import { mapErrorToApiResponse } from "../api-error";

async function parseResponse(response: Response) {
  return (await response.json()) as {
    ok: boolean;
    error: { code: string; message: string };
  };
}

describe("security-api-error", () => {
  it("maps unauthorized errors to 401 with standardized payload", async () => {
    const response = mapErrorToApiResponse(new Error("Unauthorized"), "fallback");
    const body = await parseResponse(response);

    assert.strictEqual(response.status, 401);
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.error.code, "UNAUTHORIZED");
    assert.strictEqual(body.error.message, "Unauthorized");
  });

  it("maps not found errors to 404", async () => {
    const response = mapErrorToApiResponse(new Error("Resume not found"), "fallback");
    const body = await parseResponse(response);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(body.error.code, "NOT_FOUND");
  });

  it("maps invalid input errors to 400", async () => {
    const response = mapErrorToApiResponse(
      new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
      "fallback"
    );
    const body = await parseResponse(response);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(body.error.code, "BAD_REQUEST");
  });

  it("uses internal error fallback for unknown failures", async () => {
    const response = mapErrorToApiResponse(new Error("Unexpected boom"), "Upload failed");
    const body = await parseResponse(response);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    assert.strictEqual(body.error.message, "Upload failed");
  });
});
