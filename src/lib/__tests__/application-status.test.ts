import assert from "node:assert";
import { describe, it } from "node:test";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
} from "../application-status";

describe("application-status", () => {
  it("exposes canonical status list", () => {
    assert.deepStrictEqual(APPLICATION_STATUSES, [
      "wishlist",
      "applied",
      "interview",
      "offer",
      "rejected",
    ]);
  });

  it("accepts valid statuses", () => {
    for (const status of APPLICATION_STATUSES) {
      assert.strictEqual(isApplicationStatus(status), true);
    }
  });

  it("rejects invalid statuses", () => {
    assert.strictEqual(isApplicationStatus("pending"), false);
    assert.strictEqual(isApplicationStatus(""), false);
    assert.strictEqual(isApplicationStatus("WISHLIST"), false);
  });
});
